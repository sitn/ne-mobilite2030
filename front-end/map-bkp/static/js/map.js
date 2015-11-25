/***
* SITN 2015
* This file contains all objects related to OpenLayers 3 mapping objects
***/

/*** 
* Initialize the OL3 2D map 
* Method: initMapView
* Parameters: none
***/
mb.map.initMap = function () {

    // Define Map Coordinate Reference System
    this.mapProjection = ol.proj.get(mb.params.mapconfig.mapCRS);
    this.mapProjection.setExtent(mb.params.mapconfig.projectionExtent);

    // Calculate the map center
    var mE = mb.params.mapconfig.mapExtent;
    this.mapCenter = [(mE[0] + mE[2]) / 2, (mE[1] + mE[3]) / 2];
    this.extent = mb.params.mapconfig.mapExtent;

    // WMTS configuration
    var wmtsSource = function(layer) {
        var resolutions = [100, 50, 20, 10, 5];
        var tileGrid = new ol.tilegrid.WMTS({
            origin: [514000, 236000],
            resolutions: resolutions,
            matrixIds: [0,1,2,3,4],
            extent: mb.map.extent
        });
        var extension = 'png';
        return new ol.source.WMTS( /** @type {olx.source.WMTSOptions} */({
            url: (mb.params.mapconfig.tileUrl + '1.0.0/{Layer}/default/swiss_grid_new/' +
                '{TileMatrix}/{TileRow}/{TileCol}.').replace('http:',location.protocol) + extension,
            tileGrid: tileGrid,
            layer: layer,
            requestEncoding: 'REST',
            attributions: this.attributions
        }));
    };

    // Base layer
    this.baseLayer = new ol.layer.Tile({
        source: wmtsSource('Fonds_carto')
    });

    // Overlays (layer group)
    this.overlay = new ol.layer.Group({
        opacity: 0.8,
        layers:[
            new ol.layer.Tile({
                source: wmtsSource('Routes_cantonales')
            }),
            new ol.layer.Tile({
                source: wmtsSource('Routes_nationales')
            }),
            new ol.layer.Tile({
                source: wmtsSource('Routes_projets_routiers')
            }),
            new ol.layer.Tile({
                source: wmtsSource('TP_lignes_bus_principales')
            }),
            new ol.layer.Tile({
                source: wmtsSource('Trains2016')
            }),
            new ol.layer.Tile({
                source: wmtsSource('Projet_RER')
            }),
            new ol.layer.Tile({
                source: wmtsSource('mobilite_douce')
            }),
            new ol.layer.Tile({
                source: wmtsSource('nouvelles_gares')
            }),
            new ol.layer.Tile({
                source: wmtsSource('nomenclature_localite')
            })
        ]
    });

    // Zoom control
    var zoomControl = new ol.control.Zoom();

    // Style for feature selection highlight
    var mbStyle =  new ol.style.Style({
        stroke: new ol.style.Stroke({
              color: 'rgba(252, 255, 0, 1)',
              width: 2
        }),
        image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
                width: 1.5,
                color: 'rgba(0, 255, 0, 0.8)'
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 0, 0.8)'
            })
        })
    });
    
    // Style for feature mouseoverevent
    var gjStyle =  new ol.style.Style({
        stroke: new ol.style.Stroke({
              color: 'rgba(252, 255, 0, 1)',
              width: 10
        }),
        image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
                width: 5,
                color: 'rgba(0, 255, 0, 0.8)'
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 0, 0.8)'
            })
        })
    });

    // Vector layer for feature highlight on mouseover & single click event
    this.geojsonLayer = new ol.layer.Vector({
        style: gjStyle,
        opacity: 0,
        source: new ol.source.Vector({
        })
    });

    // Disable map rotation
    var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false, mouseWheelZoom:false});
    // Map
    this.map = new ol.Map({

        controls: [
            new ol.control.ScaleLine(),
            zoomControl
        ],
        interactions: interactions,
        target: 'map',
        layers: [this.baseLayer, this.overlay, this.geojsonLayer],
        view: new ol.View({
            projection: this.mapProjection,
            extent: this.extent,
            center: this.mapCenter,
            resolution: 100,
            zoom: 6,
            minZoom: 4,
            maxZoom: 8
        })
    });

    // Single click interaction
    var selectSingleClick = new ol.interaction.Select({
        style: mbStyle,
        filter: function(feature){

            var layersEl = document.getElementsByName('layerId');
            var layerList = [];

            for (var i=0; i<layersEl.length; i++){
                if(layersEl[i].checked){
                    layerList.push(layersEl[i].value.toLowerCase());
                }
            }

            var selectLayerName = feature.get("layername").toLowerCase();
            if(layerList.indexOf(selectLayerName) >= 0){
                return true;
            } else {
                return false;
            }
        }
    });

    // Get feature info output
    selectSingleClick.on('select', function(evt){
        document.getElementById("featureInfo").style.visibility = "hidden";
        if(evt.selected.length > 0){
            selectPointerMove.getFeatures().clear();
            var libgeo = evt.selected[0].get('libgeo');
            var html = '';
            if(typeof libgeo === 'undefined' || libgeo === 'null' ){
                libgeo = 'Non renseigné';
            }

            html += '<p><b>' + libgeo + '</b></p>';

            if (html !== ''){
                document.getElementById("featureInfo").innerHTML = html;
                document.getElementById("featureInfo").style.visibility = "visible";
            }
        } 
    });

    this.map.addInteraction(selectSingleClick);

    // Hover interaction: highlight features on mouseover if the parent layer is visible
    var selectPointerMove = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        multi: false,
        layers: [this.geojsonLayer],
        filter: function(feature){
            var layersEl = document.getElementsByName('layerId');
            var layerList = [];

            for (var i=0; i<layersEl.length; i++){
                if(layersEl[i].checked){
                    layerList.push(layersEl[i].value.toLowerCase());
                }
            }

            var selectLayerName = feature.get("layername").toLowerCase();
            if(layerList.indexOf(selectLayerName) >= 0){
                return true;
            } else {
                return false;
            }
        }
    });

    selectPointerMove.on('select', function(evt){
        if(evt.selected.length === 0){
            document.getElementById("map").style.cursor = "default";
        } else {
            document.getElementById("map").style.cursor = "pointer";
        }
    });

    this.map.addInteraction(selectPointerMove);

    // Load geojson layer for high responsiveness feature query...
    mb.map.loadGeoJson(mb.params.mapconfig.geojsonLayer);
    mb.map.setOverlay();
    mb.map.fullScreen();
};

/***
* Load geojson file
* Method: loadGeoJson
* Parameters: url [string]
***/
mb.map.loadGeoJson = function(url){

    var mbStyle =  new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(252, 255, 0, 1)'
        }),
        stroke: new ol.style.Stroke({
              color: 'rgba(252, 255, 0, 1)',
              width: 2
        }),
        image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
                width: 1.5,
                color: 'rgba(0, 255, 0, 0.8)'
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 0, 0.8)'
            })
        })
    });

    var xmlhttp;
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            geojson =  JSON.parse(xmlhttp.responseText);
            var gJson = new ol.format.GeoJSON();
            var features = gJson.readFeatures(geojson);
            mb.map.geojsonLayer.getSource().addFeatures(features);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
};

/***
* Make the map full screen
* Method: fullScreen
* Parameters: none
***/
mb.map.fullScreen = function(){
    document.getElementById("map").style.width = "100%";
    document.getElementById("map").style.height = "100%";
    document.getElementById("map").style.left = "0px";
    document.getElementById("map").style.top = "0px";
    document.getElementById("map").style.background.color = "white";
    //document.getElementById("fullScreen").style.visibility = "hidden";
    //document.getElementById("partScreen").style.visibility = "visible";
    document.getElementById("map").style.border = "none";
    mb.map.map.updateSize();
};

/***
* Make the map part screen
* Method: partScreen
* Parameters: none
***/
mb.map.partScreen = function(){  
    document.getElementById("map").style.width = "80%";
    document.getElementById("map").style.height = "80%";
    document.getElementById("map").style.left = "10%";
    document.getElementById("map").style.top = "10%";
    document.getElementById("map").style.border = "1px solid gray";
    document.getElementById("fullScreen").style.visibility = "visible";
    document.getElementById("partScreen").style.visibility = "hidden";
    mb.map.map.updateSize();
};

/***
* Change the overlay layer
* Method: setOverlay
* Parameters: none
***/
mb.map.setOverlay = function (){

    var layers = this.overlay.getLayers();
    layers.forEach(function(layer, index, array){

        layer.setVisible(false);
        var layersEl = document.getElementsByName('layerId');
        for (var i=0; i<layersEl.length; i++){
            if(layersEl[i].value === layer.getSource().getLayer()){
                if(layersEl[i].checked){
                    layer.setVisible(true);
                } else {
                     layer.setVisible(false);
                }
            }
        }
    });
};

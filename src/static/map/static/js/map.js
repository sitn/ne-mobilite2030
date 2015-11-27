/***
* SITN 2015
* This file contains all objects related to OpenLayers 3 mapping objects
***/

/*** 
* Initialize the OL3 2D map 
* Method: initMapView
* Parameters: none
***/
mb.map.initMap = function (zoomFeatureId) {

    // Define Map Coordinate Reference System
    this.mapProjection = ol.proj.get(mb.params.mapconfig.mapCRS);
    this.mapProjection.setExtent(mb.params.mapconfig.projectionExtent);

    // Calculate the map center
    this.extent = mb.params.mapconfig.mapExtent;
    this.mapCenter = [(this.extent[0] + this.extent[2]) / 2, (this.extent[1] + this.extent[3]) / 2];

    // WMTS configuration
    var wmtsSource = function(layer) {
        var tileGrid = new ol.tilegrid.WMTS({
            resolutions: mb.params.mapconfig.resolutions,
            matrixIds: mb.params.mapconfig.matrixIds,
            extent: mb.map.extent
        });
        var extension = 'png';
        return new ol.source.WMTS( /** @type {olx.source.WMTSOptions} */({
            url: (mb.params.mapconfig.tileUrl + '1.0.0/{Layer}/default/swiss_grid_new/' +
                '{TileMatrix}/{TileRow}/{TileCol}.').replace('http:',location.protocol) + extension,
            tileGrid: tileGrid,
            layer: layer,
            requestEncoding: 'REST'
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
    var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false});

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
            resolutions: mb.params.mapconfig.resolutions
        })
    });

    // Single click interaction
    var selectSingleClick = new ol.interaction.Select({
        style: mbStyle,
        filter: function(feature){

            var layersEl = document.getElementsByName('layerId');
            var layerList = [];

            for (var i = 0; i<layersEl.length; i++){
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
            var pilier = evt.selected[0].get('pilier');
            var projet = evt.selected[0].get('projet');
            var date_realisation = evt.selected[0].get('date_realisation');
            var cout_total = evt.selected[0].get('cout_total');
            var cout_canton = evt.selected[0].get('cout_canton');
            var url_piliers = evt.selected[0].get('url_piliers');
            var html = '';
            if(typeof libgeo === 'undefined' || libgeo === 'null' ){
                libgeo = 'Non renseigné';
            }
            html += '<p><b>' + libgeo + '</b></p>';
            if(pilier){
                html += '<p><b>Pilier: </b>' + pilier + '</p>';
            }
            if(projet){
                html += '<p><b>Projet: </b>' + projet + '</p>';
            }
            if(date_realisation){
                html += '<p><b>Date de réalisation: </b>' + date_realisation + '</p>';
            }
            if(cout_total){
                html += '<p><b>Coût total: </b>' + cout_total + '</p>';
            }
            if(cout_canton){
                html += '<p><b>Coût canton: </b>' + cout_canton + '</p>';
            }
            if(url_piliers){
                html += '<p><a href="' + url_piliers + '">Plus d\'informations </a></p>';
            }
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
    mb.map.loadGeoJson(mb.params.mapconfig.geojsonLayer, zoomFeatureId);
    mb.map.setOverlay();
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
            // Fit map extent to window
            var vExt = mb.map.geojsonLayer.getSource().getExtent();
            var f = mb.params.mapconfig.extentCorrection;
            var adaptedExtent = [vExt[0] + f, vExt[1] + f, vExt[2] - f, vExt[3] - f];
            mb.map.map.getView().fit(adaptedExtent, mb.map.map.getSize());
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
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

/***
* Select feature and fit extent accordingly
* Method: zoomToFeature
* Parameters: filter [string]
***/
mb.map.zoomToFeature = function (filter){

    /* filter possible values: 
        => mb.map.zoomToFeature('7c5eab57-43c8-4574-bcc2-4c191a7074e0') Ligne directe Neuchâtel - la Chaux-de-Fonds
        => mb.map.zoomToFeature('a37f2254-6b99-4c3c-a80d-057d7f3c9f4c') Bôle - Corcelle
        => mb.map.zoomToFeature('4ca3f933-6c2e-425d-8551-30a77c892523') Électrification La CdF - Morteau
        => mb.map.zoomToFeature('0fd5890b-c641-4d68-b599-096eba3945a6') Littorail Est
    */
    var features = mb.map.geojsonLayer.getSource().getFeatures();
    var zoomExtent;
    var featureCollection = new ol.Collection();

    var zoomExtents = [];
    
    for (var i=0; i < features.length; i++){
        var idobj = features[i].get('idobj');
        if (idobj && idobj.toLowerCase().trim() == filter.toLowerCase().trim()){
            zoomExtents.push(features[i].getGeometry().getExtent());
        }
    }
    
    if (zoomExtents.length === 0){
        return;
    }
    
    if (zoomExtents.length > 1){
        zoomExtent = zoomExtents[0];
        for (var j = 1; j < zoomExtents.length; j++){
            zoomExtent = ol.extent.extend(zoomExtent, features[j].getGeometry().getExtent());
        }
    } else {
        zoomExtent = zoomExtents[0];
    }

    if (typeof zoomExtent !== 'null'){
        mb.map.map.getView().fit(zoomExtent, mb.map.map.getSize());
    }

};

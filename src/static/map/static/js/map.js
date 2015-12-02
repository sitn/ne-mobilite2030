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

    // Helping functions
    function compareCoordinates(coord1, coord2){
        var
            lon1 = Math.round(coord1[0]),
            lon2 = Math.round(coord2[0]),
            lat1 = Math.round(coord1[1]),
            lat2 = Math.round(coord2[1]);

        var
            percent_lon = Math.abs(lon1 / lon2 - 1).toFixed(4),
            percent_lat = Math.abs(lat1 / lat2 - 1).toFixed(4);
            percent = (Number(percent_lon) + Number(percent_lat) / 2).toFixed(4);

        return percent;
    }

    function between(number, min, max){
        if(number >= min && number <= max) return true;
        else return false;
    }

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
              width: 2
        }),
        image: new ol.style.Circle({
            radius: 10,
            stroke: new ol.style.Stroke({
                width: 1.5,
                color: 'rgba(0, 255, 0, 0.8)'
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 0, 1)'
            })
        })
    });
    
    this.geojsonLayer = new ol.layer.Vector({
        style: gjStyle,
        opacity: 0,
        source: new ol.source.Vector({
        })
    });

    var overlayStyle = [
        new ol.style.Style({
            fill: new ol.style.Fill({ color: [255, 255, 255, 0.5] })
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 255, 255, 1], width: 3.5
            })
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [0, 153, 255, 1], width: 2.5
            })
        })
    ];

    // Hovering layer
    this.featureOverlay = new ol.layer.Vector({
        style: overlayStyle,
        source: new ol.source.Vector({
        })
    });

    var selectStyle = [
        new ol.style.Style({
            fill: new ol.style.Fill({ color: [255, 255, 255, 0.5] })
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 255, 255, 1], width: 3.5
            })
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 255, 0, 1], width: 2.5
            })
        })
    ];
    // Feature selection layer
    this.selectOverlay = new ol.layer.Vector({
        style: selectStyle,
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
        layers: [this.baseLayer, this.overlay, this.geojsonLayer, this.featureOverlay, this.selectOverlay],
        view: new ol.View({
            projection: this.mapProjection,
            resolutions: mb.params.mapconfig.resolutions
        })
    });

    this.map.on('pointermove', function(e) {

        if (e.dragging) return;

        var pixel = mb.map.map.getEventPixel(e.originalEvent);
        var hit = mb.map.map.hasFeatureAtPixel(pixel);

        document.getElementById("map").style.cursor = "default";

        if(hit){

            // Set pointer to default
            document.getElementById("map").style.cursor = "pointer";

            // Get closest feature
            var pointer_coord = mb.map.map.getEventCoordinate(e.originalEvent);
            var closest = mb.map.geojsonLayer.getSource().getClosestFeatureToCoordinate(pointer_coord);

            if (closest){

                // Check if feature belongs to selectable/active layer

                var layersEl = document.getElementsByName('layerId');
                var layerList = [];

                for (var i = 0; i<layersEl.length; i++){
                    if(layersEl[i].checked){
                        layerList.push(layersEl[i].value.toLowerCase());
                    }
                }

                var selectLayerName = closest.get("layername").toLowerCase();
                if(layerList.indexOf(selectLayerName) >= 0 && mb.params.mapconfig.selectableLayers.indexOf(selectLayerName) >= 0){
                    mb.map.featureOverlay.getSource().clear();
                    mb.map.featureOverlay.getSource().addFeatures([closest]);
                }
            }
        }
    });

    this.map.on('click', function(e) {

        if (e.dragging) return;

        var pixel = mb.map.map.getEventPixel(e.originalEvent);
        var hit = mb.map.map.hasFeatureAtPixel(pixel);

        document.getElementById("map").style.cursor = "default";

        if(hit){

            // Set pointer to default
            document.getElementById("map").style.cursor = "pointer";

            // Get closest feature
            var pointer_coord = mb.map.map.getEventCoordinate(e.originalEvent);
            var closest = mb.map.geojsonLayer.getSource().getClosestFeatureToCoordinate(pointer_coord);

            if (closest){

                // Check if feature belongs to selectable/active layer

                var layersEl = document.getElementsByName('layerId');
                var layerList = [];

                for (var i = 0; i<layersEl.length; i++){
                    if(layersEl[i].checked){
                        layerList.push(layersEl[i].value.toLowerCase());
                    }
                }

                var selectLayerName = closest.get("layername").toLowerCase();
                if(layerList.indexOf(selectLayerName) >= 0 && mb.params.mapconfig.selectableLayers.indexOf(selectLayerName) >= 0){
                    mb.map.selectOverlay.getSource().clear();
                    mb.map.selectOverlay.getSource().addFeatures([closest]);
                    document.getElementById("featureInfo").style.visibility = "hidden";
                    mb.map.setFeatureInfo(closest);
                }
            }
        }
    });

    mb.map.loadGeoJson(mb.params.mapconfig.geojsonLayerUrl, this.geojsonLayer, zoomFeatureId);
    mb.map.setOverlay();
    mb.map.fullScreen();
};

/***
* Load geojson file
* Method: loadGeoJson
* Parameters: url [string]
***/
mb.map.loadGeoJson = function(url, layer, zoomFeatureId){

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
            for (var i = 0; i<features.length; i++){
                var f = features[i];
                layer.getSource().addFeatures([f]);
            }

            // Fit map extent to window
            if (zoomFeatureId == 'zoom_full_extent'){
                var vExt = mb.params.mapconfig.mapExtent;
                var fe = mb.params.mapconfig.extentCorrection;
                var adaptedExtent = [vExt[0] + fe, vExt[1] + fe, vExt[2] - fe, vExt[3] - fe];
                mb.map.map.getView().fit(adaptedExtent, mb.map.map.getSize());
            } else {
                mb.map.zoomToFeature(zoomFeatureId);
            }
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
    var features= mb.map.geojsonLayer.getSource().getFeatures();

    // Only on feature get sele

    var zoomExtent;
    var featureCollection = new ol.Collection();

    var zoomExtents = [];

    for (var i=0; i < features.length; i++){
        var mobilite_id = features[i].get('mobilite_id');
        if (mobilite_id && mobilite_id.toLowerCase().trim() == filter.toLowerCase().trim()){
            zoomExtents.push(features[i].getGeometry().getExtent());
            mb.map.setFeatureInfo(features[i]); // for test
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

/***
* set the featureInfo content
* Method: setFeatureInfo
* Parameters: feature [ol.Feature]
***/
mb.map.setFeatureInfo = function(feature){

    document.getElementById("featureInfo").style.visibility = "hidden";
    var libgeo = feature.get('libgeo');
    var pilier = feature.get('pilier');
    var projet = feature.get('projet');
    var date_realisation = feature.get('date_realisation');
    var cout_total = feature.get('cout_total');
    var cout_canton = feature.get('cout_canton');
    var is_active_link = feature.get('is_active_link');
    var mobilite_id = feature.get('mobilite_id');
    var html = '';

    if(!libgeo){
        return;
    }

    if(typeof libgeo === 'undefined' || libgeo === 'null' ){
        return;
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
    console.log(is_active_link);
    if(is_active_link == 'on' && mobilite_id){
        html += '<p><a class="mobilite-link-custom" href="piliers.html#' + mobilite_id + '">Plus d\'informations </a></p>';
    }
    if (html !== ''){
        document.getElementById("featureInfo").innerHTML = html;
        document.getElementById("featureInfo").style.visibility = "visible";
    }
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
    document.getElementById("map").style.border = "none";
    mb.map.map.updateSize();
};


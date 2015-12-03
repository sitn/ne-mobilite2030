/***
* SITN 2015
* This file contains all objects related to OpenLayers 3 mapping objects
***/

/*** 
* Initialize the OL3 2D map 
* Method: initMapView
* Parameters: zoomFeatureId [String]
* Use a valid zoomFeatureId to open map on specific entity
* Use "zoom_full_extent" to open map on complete extent
***/
mb.map.initMap = function (zoomFeatureId) {

    this.mapProjection = ol.proj.get(mb.params.mapconfig.mapCRS);
    this.mapProjection.setExtent(mb.params.mapconfig.projectionExtent);
    this.extent = mb.params.mapconfig.mapExtent;
    this.mapCenter = [(this.extent[0] + this.extent[2]) / 2, (this.extent[1] + this.extent[3]) / 2];

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
    
    this.geojsonLayer = new ol.layer.Vector({
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                  color: 'rgba(252, 255, 0, 1)',
                  width: 2
            })
        }),
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

    var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false});

    this.map = new ol.Map({
        controls: [
            new ol.control.ScaleLine(),
            new ol.control.Zoom()
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

        mb.map.featureOverlay.getSource().clear();

        if (e.dragging) return;

        var pixel = mb.map.map.getEventPixel(e.originalEvent);
        var hit = mb.map.map.hasFeatureAtPixel(pixel);

        document.getElementById("map").style.cursor = "default";

        if(hit){

            var pointer_coord = mb.map.map.getEventCoordinate(e.originalEvent);
            var closest = mb.map.geojsonLayer.getSource().getClosestFeatureToCoordinate(pointer_coord);

            if (closest){

                var layersEl = document.getElementsByName('layerId');
                var layerList = [];

                for (var i = 0; i<layersEl.length; i++){
                    if(layersEl[i].checked){
                        layerList.push(layersEl[i].value.toLowerCase());
                    }
                }

                var selectLayerName = closest.get("layername").toLowerCase();
                if(layerList.indexOf(selectLayerName) >= 0 && mb.params.mapconfig.selectableLayers.indexOf(selectLayerName) >= 0){
                    document.getElementById("map").style.cursor = "pointer";
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

            // Get closest feature
            var pointer_coord = mb.map.map.getEventCoordinate(e.originalEvent);
            var closest = mb.map.geojsonLayer.getSource().getClosestFeatureToCoordinate(pointer_coord);

            if (closest){

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
    if (window.XMLHttpRequest){ // IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// IE6, IE5
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
    layers.forEach(function(layer){

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

    var features = mb.map.geojsonLayer.getSource().getFeatures();
    var zoomExtent;
    mb.map.selectOverlay.getSource().clear();
    var selectedFeatures = [];
    var featureMatched = false;
    var adaptedExtent;
    var fe = mb.params.mapconfig.extentCorrection;

    for (var i=0; i < features.length; i++){
        var mobilite_id = features[i].get('mobilite_id');
        if (mobilite_id && mobilite_id.toLowerCase().trim() == filter.toLowerCase().trim()){
            selectedFeatures.push(features[i]);
            featureMatched = true;
        }
    }

    if (selectedFeatures.length > 1){
        zoomExtent = selectedFeatures[0].getGeometry().getExtent();
        for (var j = 1; j < selectedFeatures.length; j++){
            zoomExtent = ol.extent.extend(zoomExtent, selectedFeatures[j].getGeometry().getExtent());
        }
    } else {
        zoomExtent = selectedFeatures[0].getGeometry().getExtent();
    }

    if (featureMatched){
        mb.map.map.getView().fit(zoomExtent, mb.map.map.getSize());
        mb.map.selectOverlay.getSource().addFeatures(selectedFeatures);
        mb.map.setFeatureInfo(selectedFeatures[0]);
    } else {
        var vExt = mb.params.mapconfig.mapExtent;
        adaptedExtent = [vExt[0] + fe, vExt[1] + fe, vExt[2] - fe, vExt[3] - fe];
        mb.map.map.getView().fit(adaptedExtent, mb.map.map.getSize());
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

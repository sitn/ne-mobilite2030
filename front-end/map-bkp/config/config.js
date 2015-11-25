/**
* Set up global parameters here
*/

mb.params = {
   'versionInfo': 'Mobilite - dev',
   'mapconfig': {
        'mapExtent': [516000, 176000, 580000, 230000], // initial map extent at loading in map CRS
        'attributionsHtml': 'Tiles &copy; <http://ne.ch/sitn">SITN</a>', // map's attributions
        'mapCRS': 'EPSG:21781', // Map's CRS
        'projectionExtent': [433000, 52000, 858000, 316000], // Map's project extent
        'wmtsGetCapabilities': 'config/WMTSCapabilities.xml',
        'mapDefaultLayer': 'Fonds_carto',
        'mapServiceUrl': 'http://sitn.ne.ch/ogc-sitn-mobilite2030/wms',
        'mapServiceImageFormat': 'map/image/png',
        'overlayServiceUrl': 'http://sitn.ne.ch/ogc-sitn-mobilite2030/wms',
        'overlayDefaultLayer': 'TP_lignes_bus_principales,Projet_RER,nouvelles_gares,Trains2016,mobilite_douce',
        'geojsonLayer': 'map/data/geojson/mobilite2030.json',
        'tileUrl': 'http://tile{1-5}-mobilite2030.ne.ch/tiles/'
    }
};

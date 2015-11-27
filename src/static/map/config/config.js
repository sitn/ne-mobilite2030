/**
* Set up global parameters here
*/

mb.params = {
   'versionInfo': 'Mobilite - dev',
   'mapconfig': {
        'mapExtent': [514000, 176000, 580000, 236000], // initial map extent at loading in map CRS
        'mapCRS': 'EPSG:21781', // Map's CRS
        'projectionExtent': [433000, 52000, 858000, 316000], // Map's project extent
        'mapDefaultLayer': 'Fonds_carto',
        'geojsonLayer': 'map/data/geojson/mobilite2030.json',
        'tileUrl': 'http://tile{1-5}-mobilite2030.ne.ch/tiles/',
        'resolutions': [100, 50, 20, 10, 5],
        'matrixIds': [0,1,2,3,4],
        'extentCorrection': 10000, //[m]
        'selectableLayers': ['routes_projets_routiers', 'trains2016', 'projet_rer', 'mobilite_douce', 'nouvelles_gares', 'arrets2016', 'arrets2030']
    }
};

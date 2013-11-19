(function (document, window) {
    'use strict';
    var scripts = [
        "source/application/application.js",

        "source/Models/searchResult.js",
        "source/Models/favorites.js",
        "source/Models/searchHistory.js",
        "source/Models/location.js",

        "source/views/homeContent/homeContent.js",
        "source/views/homeContent/filter/filter.js",
        "source/views/homeContent/search/search.js",
        "source/views/homeContent/searchHistory/searchHistory.js",
        "source/views/locations/locations.js",
        "source/views/searchResult/searchResult.js",
        "source/views/details/details.js",
        "source/views/favorite/favorite.js"
    ];
    function onEndLoad() {
        var core = window.RAD.core,
            application = window.RAD.application,
            coreOptions = {
                defaultBackstack: true,
                defaultAnimation: 'slide',
                animationTimeout: 3000,
                debug: false
            };
        core.initialize(application, coreOptions);
        application.start();
    }
    window.RAD.scriptLoader.loadScripts(scripts, onEndLoad);
}(document, window));
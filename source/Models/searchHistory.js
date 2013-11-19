RAD.model('searchHistory', Backbone.Collection.extend({
    JSONParse: function () {
        "use strict";
        if (window.localStorage.getItem('recentSearch') !== null && window.localStorage.getItem('recentSearch') !== '') {
            var some = JSON.parse(window.localStorage.getItem('recentSearch'));
            this.add(some);
        }
    }
}), true);
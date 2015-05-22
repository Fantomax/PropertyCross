(function () {
    var Model = Backbone.Model.extend({
        idAttribute: 'guid'
    });

    RAD.model('favorites', Backbone.Collection.extend({
        model: Model,
        JSONParse: function () {
            "use strict";
            if (window.localStorage.getItem('favorites') !== null && window.localStorage.getItem('favorites') !== '') {
                var some = JSON.parse(window.localStorage.getItem('favorites'));
                this.add(some);
            }
        }
    }), true);
}) ();
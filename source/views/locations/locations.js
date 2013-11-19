RAD.view('view.location', RAD.Blanks.ScrollableView.extend({
    url : "source/views/locations/locations.html",
    onInitialize: function () {
        "use strict";
        this.model = RAD.models.locationModel;
        this.title = 'Location';
    },
    events : {
        'tap .searchPrevRes' : 'searchPrevRes',
        'tap .toRecentSearch' : 'toRecentSearch',
        'tap .toAdvancedSearch' : 'toAdvancedSearch'
    },
    onNewExtras: function (data) {
        this.nameOfBack = data.nameOfBack;

    },
    onStartAttach: function () {
        var but = this.$('#buttonBack');
        but.html('To '+ this.nameOfBack + ' Search');
        but.removeClass().addClass('to' + this.nameOfBack + 'Search');
    },
    toRecentSearch: function () {
        var options = {
            container_id: "#searchHistory",
            content: "view.searchHistory"
        };
        this.publish('navigation.back', options)
    },
    toAdvancedSearch: function () {
        var options = {
            container_id: "#content",
            content: "view.filter"
        };
        this.publish('navigation.back', options)
    },
    searchPrevRes: function (e) {
        "use strict";
        $('#spinnerAll').css('display', 'block');
        var $target = $(e.target),
            sw = $target.attr('data-target'),
            self = this,
            page = 1;
        if (self.nameOfBack === 'Advanced') {
            RAD.models.searchResult.buildUrl({city: sw, page: page, location: 'location', filters: '', useFilter: 'true', searchRes: false, thisName: 'advancLoc'});
        } else {
            RAD.models.searchResult.buildUrl({city: sw, page: page, location: 'location', filters: '', useFilter: 'false', searchRes: false});
        }
    }
}));
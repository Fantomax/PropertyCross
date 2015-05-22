RAD.view('view.search', RAD.Blanks.View.extend({
    url: "source/views/homeContent/search/search.html",

    onEndRender : function () {
        "use strict";
        $('#search').css('height', this.$el.children().css('height'));
    },

    events : {
        'submit .searchRorm' : 'result',
        'tap #myLocation' : 'getLocation'
    },
    result : function (e) {
        "use strict";
        e.preventDefault();
        $('#spinnerAll').css('display', 'block');
        var page = 1,
            inputObj = $('#searchWord'),
            inputVal = inputObj.val().toLowerCase();
        if (!inputVal) {
            this.searchHistoryMarTop('Empty request');
            $('#spinnerAll').css('display', 'none');
            return;
        }
        inputObj.removeClass('error');

        RAD.models.searchResult.buildUrl({city: inputVal, page: page, location: 'location', filters: '', useFilter: 'false', searchRes: false});
    },
    getLocation : function (e) {
        "use strict";
        var location = 'centre_point';
        $('#spinnerAll').css('display', 'block');
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude,
                longitude = position.coords.longitude,
                sw = latitude + ',' + longitude;
            RAD.models.searchResult.buildUrl(sw, 1, location);
        }, function () {
            $(e.currentTarget).css('display', 'none');
            $('#spinnerAll').css('display', 'none');
        });
    },
    searchHistoryMarTop: function (errorString) {
        var err = $('.error'),
            $searchHistory = $('#searchHistory');
        if (err.height() === 0) {
            err.css('padding', '7px 10px');
            err.html('a');
            $searchHistory.css('top', parseInt($searchHistory.css('top')) + parseInt(err.css('height')));
            $searchHistory.bind('transitionend webkitTransitionEnd', function () {
                RAD.core.getView($searchHistory.attr('view')).refreshScroll();
            })
        }
        err.html(errorString);
    }
}));
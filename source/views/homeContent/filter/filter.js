RAD.view('view.filter', RAD.Blanks.ScrollableView.extend({
    url: "source/views/homeContent/filter/filter.html",
    onInitialize: function () {
        this.title = 'Advanced Search';
    },
    events: {
        'swipe' : 'showMain',
        'submit .searchRorm' : 'result',
        'tap #myLocation' : 'getLocation'
    },
    showMain: function (e) {
        if (e.originalEvent.swipe.direction === 'left' && e.originalEvent.swipe.speed > 0.5) {
            var options = {
                container_id: '#content',
                content: 'view.homeContent',
                backstack: false
            };
            this.publish('navigation.show', options);
        }
    },
    result : function (e) {
        "use strict";
        e.preventDefault();
        $('#spinnerAll').css('display', 'block');
        var page = 1,
            inputObj = $('#searchWord'),
            inputVal = inputObj.val().toLowerCase(),
            filter,
            minCost = this.$('input[name=min_cost]').val() || 0,
            maxCost = this.$('input[name=max_cost]').val() || 999999999;
        if (!inputVal) {
            this.searchHistoryMarTop('Empty request');
            $('#spinnerAll').css('display', 'none');
            return;
        }
        filter = '&listing_type=' + this.$('input[name=listing_type]:checked').val() +
            '&property_type=' + this.$('input[name=property_type]:checked').val() +
            '&price_min=' + minCost + '&price_max=' + maxCost;

        RAD.models.searchResult.buildUrl({
            city: inputVal,
            page: page,
            location: 'location',
            filters: filter,
            useFilter: 'true',
            searchRes: false,
            thisName: 'filter'
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
}))
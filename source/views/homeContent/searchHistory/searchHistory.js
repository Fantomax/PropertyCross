RAD.view('view.searchHistory', RAD.Blanks.ScrollableView.extend({
    url: "source/views/homeContent/searchHistory/searchHistory.html",

    onInitialize: function () {
        "use strict";
        this.model = RAD.models.searchHistory;
        this.title = 'PropertyCross';
    },
    onEndRender: function () {
        "use strict";
        var top = $('.relativebox').height() + 20 + 'px';
        $('#searchHistory').css('top', top);
    },
    events: {
        'tap .showThis' : 'showThis'
    },
    onStartAttach: function () {
        $('#searchHistory').addClass('animation');
    },
    showThis: function (e) {
        "use strict";
        $('#spinnerAll').css('display', 'block');
        var currentTarg = $(e.currentTarget).data('target') || $(e.currentTarget).find('.cityName').html();
        RAD.models.searchResult.buildUrl({
            city: currentTarg,
            page: 1,
            location: 'location',
            filters: '',
            useFilter: 'false',
            searchRes: false
        });
    }
}));
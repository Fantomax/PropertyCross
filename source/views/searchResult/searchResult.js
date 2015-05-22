RAD.view('view.searchResult', RAD.Blanks.ScrollableView.extend({
    url: "source/views/searchResult/searchResult.html",

    onInitialize: function () {
        "use strict";
        this.model = RAD.models.searchResult;
        this.page = 1;
        this.title = this.model.length + ' of ' + this.model.totalRes + ' matches';
    },
    events: {
        'tap #loadMore' : 'loadMore',
        'tap li' : 'showDetails'
    },
    onStartAttach: function () {
        "use strict";
        console.log(arguments);
        var self = this,
            $pullTo = self.$('#pullTo'),
            maxYscroll = self.mScroll.maxScrollY;
        self.title = this.model.length + ' of ' + this.model.totalRes + ' matches';
        self.publish('count_pages', {title: self.title});
        $('.title').html(this.model.length + ' of ' + this.model.totalRes + ' matches');
        if(self.model.needRender) {
            self.model.trigger('change');
            self.model.needRender = false;
        }
        function onRefresh() {
            $pullTo = self.$el.find('#pullTo');
        }
        this.mScroll.options.onScrollStart = function () {
            if (maxYscroll !== self.mScroll.maxScrollY) {
                maxYscroll = self.mScroll.maxScrollY;
                onRefresh();
            }
        }
        this.mScroll.options.onScrollMove = function () {
            if (this.y < maxYscroll - 51) {
                $pullTo.addClass('down');
            } else {
                $pullTo.removeClass('down');
            }
        }
        this.mScroll.options.onScrollEnd = function () {
            if ($pullTo.hasClass('down')) {
                $pullTo.attr('src', 'source/assets/images/bdrWh.png');
                $pullTo.addClass('spinner');
                self.page += 1;
                RAD.models.searchResult.buildUrl({page: self.page, searchRes: true});
            }
        }
    },
    showDetails: function (e) {
        "use strict";
        var currentTarget = e.currentTarget,
            guid = currentTarget.getAttribute('data-modelid');
        if (currentTarget.id !== 'loadMore') {
            $('#navigation').find('.active').removeClass('active');
            var options = {
                container_id: '#content',
                content: 'view.detailsResult',
                extras: {
                    guid: guid,
                    currIndex: $(currentTarget).index()
                }
            };
            this.publish('apply_title', {title: 'Details', buttons: true, guid: guid});
            this.publish('navigation.show', options);
        }
    },
    isFavor: function (guid) {
        return !!RAD.models.favorites.get(guid);
    }
}));
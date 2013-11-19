RAD.view('view.favorite', RAD.Blanks.ScrollableView.extend({
    url: "source/views/favorite/favorite.html",
    onInitialize: function () {
        "use strict";
        this.model = RAD.models.favorites;
        this.title = 'Favorite';
    },
    events: {
        'tap li' : 'showDetails'
    },
    showDetails: function (e) {
        "use strict";
        var currentTarget = e.currentTarget,
            guid = currentTarget.getAttribute('data-modelid'),
            options = {
                container_id: '#content',
                content: 'view.detailsFavor',
                backstack: true,
                extras: {
                    guid: guid,
                    currIndex: $(currentTarget).index()
                }
            };
        $('#navigation').find('.active').removeClass('active');
        this.publish('apply_title', {title: 'Details', buttons: true, guid: guid});
        this.publish('navigation.show', options);
    },
    onStartRender: function () {
        console.log('view.favorite');
    }
}));
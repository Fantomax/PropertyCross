RAD.view('view.ParentView', RAD.Blanks.View.extend({
    url: "source/views/ParentView.html",
    children : [
        {
            container_id: "#content",
            content: "view.homeContent"
        }
    ],

    onInitialize: function () {
        document.body.onresize = this.resizeWind;
        this.title = 'PropertyCross';
        RAD.models.favorites.JSONParse();
        RAD.models.searchHistory.JSONParse();
        this.subscribe('navigation', this.apTitle, this);
        this.subscribe('count_pages', this.applyCountPagesTitle, this);
    },
    onStartAttach: function () {
        $('.shadow').css('display', 'none');
    },
    apTitle: function (channal, data) {
        var $back = this.$('.back'),
            $info = this.$('.info'),
            $shadow = this.$('.shadow'),
            $favorite = this.$('.favorites');
        this.title = RAD.core.getView(data.content).title;
        this.$('.title').html(this.title);
        if (data.content === 'view.homeContent') {
            $back.removeClass('back');
            $back.addClass('info');
            $shadow.css('display', 'none');
        } else {
            $shadow.css('display', 'block');
        }

        if (data.content === 'view.searchResult') {
            $info.removeClass('info');
            $info.addClass('back');
        }

        if (data.content === 'view.detailsFavor' || data.content === 'view.favorite' || data.content === 'view.filter' || RAD.core.getView(data.content).nameOfBack === 'Advanced') {
           $favorite.css('display', 'none');
        } else {
            $favorite.css('display', 'block')
        }

        if (data.content === 'view.filter' || RAD.core.getView(data.content).nameOfBack === 'Advanced') {
            $info.css('display', 'none');
            $back.css('display', 'block');
        } else {
            $info.css('display', 'block');
            $back.css('display', 'block');
        }
    },
    applyCountPagesTitle: function (ch, data) {
        this.$('.title').html(data.title);
    },
    events: {
        'tap .info' : 'showInfo',
        'tap .favorites' : 'showFavorites',
        'tap .back' : 'historyBack'
    },
    historyBack: function () {
        this.publish('fovor_delete', {deleteStack : true});
        this.publish('router.back', null);
    },
    showFavorites: function () {
        this.publish('fovor_delete', {deleteStack : true});
        var options = {
                container_id: '#content',
                content: 'view.favorite'
            },
            infoToBack = this.$('.info');
        this.publish('navigation.show', options);
        infoToBack.removeClass('info');
        infoToBack.addClass('back')
    },
    showInfo: function (e) {
        var intro = $('.intro'),
            $searchHistory = $('#searchHistory'),
            $currentTarg = $(e.currentTarget),
            sp;
        if (intro.height() > 0) {
            intro.height(0);
            $currentTarg.css('background-color', '#2f3945');
            $searchHistory.css('margin-top', 0  + 'px');
        } else {
            sp = $('.intro div');
            intro.height(sp.height() + 40);
            $currentTarg.css('background-color', '#202731');
            $searchHistory.css('margin-top', sp.height() + 30 + 'px');
        }
        $searchHistory.bind('transitionend webkitTransitionEnd', function () {
            RAD.core.getView($searchHistory.attr('view')).refreshScroll();
        })
    },
    resizeWind: function () {
        "use strict";
        var search = $('.relativebox'),
            sHeight = search.height() + 10;
        $('#search').height(sHeight);
        $('#searchHistory').css('top', sHeight + 'px');
    }
}));
RAD.view('view.homeContent', RAD.Blanks.View.extend({
    url: "source/views/homeContent/homeContent.html",
    children: [
        {
            container_id: "#search",
            content: "view.search"
        },
        {
            container_id: "#searchHistory",
            content: "view.searchHistory"
        }
    ],
    onInitialize: function () {
        this.title = 'PropertyCross'
    },
    events: {
        'swipe' : 'filterShow'
    },
    filterShow: function (e) {
        if (e.originalEvent.swipe.direction === 'right' && e.originalEvent.swipe.speed > 0.5) {
            var options = {
                container_id: '#content',
                content: 'view.filter',
                backstack: true
            };
            this.publish('navigation.back', options);
        }
    }
}));
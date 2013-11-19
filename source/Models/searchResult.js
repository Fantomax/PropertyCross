(function () {
    "use strict";
    var Model = Backbone.Model.extend({
        idAttribute: 'guid'
    });

    RAD.model('searchResult', Backbone.Collection.extend({
        model: Model,
        buildUrl : function (urlData) {
            "use strict";
            var self = this,
                cityBool = true;
            if (!urlData.city) {
                cityBool = false;
            }
            this.useFilter = urlData.useFilter || this.useFilter;
            if (this.useFilter === 'true') {
                this.filters = urlData.filters || this.filters;
            } else {
                this.filters = '';
            }
            this.location = urlData.location || this.location;
            this.city =  urlData.city || this.city;
            this.url = 'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&page=' + urlData.page + '&' + this.location + '=' + this.city + this.filters + '&callback=?';
            this.fetch({
                remove: cityBool,
                silent: true,
                success: function (data) {
                    if (!urlData.searchRes) {
                        self.forSucces(data, self.city, urlData.thisName);
                    }
                    self.trigger('change');
                },
                error: function () {
                    $('#spinnerAll').css('display', 'none');
                    this.searchHistoryMarTop('Network error');
                    self.trigger('change');
                }
            })
        },
        parse : function (response) {
            "use strict";
            this.status_code = +response.response.application_response_code;
            if (this.status_code === 100 || this.status_code === 101 || this.status_code === 110) {
                this.totalRes = response.response.total_results;
                return response.response.listings;
            }
            if (this.status_code === 200 || this.status_code === 202 || this.status_code === 500) {
                return response.response.locations;
            }
            if (this.status_code === 201 || this.status_code === 210 || this.status_code === 900) {
                return response.response;
            }
        },
        forSucces : function (data, sw, viewName) {
            "use strict";
            var options = {
                    content: 'view.searchResult',
                    container_id: '#content',
                    animation: 'slide',
                    backstack: true
                },
                flag,
                container,
                nameOfBack = '',
                self = this;
            if (viewName === 'filter') {
                container = '#content';
                nameOfBack = 'Advanced'
            } else {
                container = '#searchHistory';
                nameOfBack = 'Recent'
            }
            $('#spinnerAll').css('display', 'none');
            if ((data.status_code === 200 || data.status_code === 202 || data.status_code === 500) && (data.models.length > 0)) {
                RAD.models.locationModel.reset(data.models);
                RAD.core.publish('navigation.show', {container_id: container, content: 'view.location', backstack: false, extras: {nameOfBack: nameOfBack}});
                self.emptyError();
                return false;
            }
            if ((data.status_code === 100 || data.status_code === 101 || data.status_code === 110) && (data.models.length > 0)) {
                flag = RAD.models.searchHistory.where({city : sw}).length > 0;

                if (!flag) {
                    if (RAD.models.searchHistory.length === 5) {
                        RAD.models.searchHistory.remove(RAD.models.searchHistory.at(0));
                    }
                    RAD.models.searchHistory.add({city: sw, total: data.totalRes});
                    window.localStorage.setItem('recentSearch', JSON.stringify(RAD.models.searchHistory));
                } else {
                    RAD.models.searchHistory.findWhere({city: sw}).set('total', data.totalRes);
                    window.localStorage.setItem('recentSearch', JSON.stringify(RAD.models.searchHistory));
                }
                if (viewName !== 'filter' && viewName !== 'advancLoc') {
                    RAD.core.publish('navigation.show', {container_id: '#searchHistory', content: 'view.searchHistory', backstack: false, animation: 'none'});
                }
                RAD.core.publish('navigation.show', options);
                self.emptyError();
            }
            if (data.status_code === 201 || data.status_code === 210 || data.status_code === 900) {
                this.searchHistoryMarTop('There was a problem with your search');
            }
            if (data.models.length === 0) {
                this.searchHistoryMarTop('No properties at your request');
            }
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
        },
        emptyError: function () {
            var err = $('.error'),
                searchHis = $('#searchHistory');
            searchHis.css('top', parseInt(searchHis.css('top')) - parseInt(err.css('height')));
            err.empty();
            err.css('padding', '0');
        }
    }), true);
}());
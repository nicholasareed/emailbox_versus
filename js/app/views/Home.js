define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        models              = require('app/models/trip'),
        models_cars         = require('app/models/car'),
        models_drivers      = require('app/models/driver'),

        Hammer              = require('hammer'),

        HomeLastTripView    = require('app/views/HomeLastTrip'),
        HomeCarListView     = require('app/views/HomeCarList'),
        HomeDriverListView     = require('app/views/HomeDriverList'),

        DriverSelectView    = require('app/views/DriverSelect'),

        Utils            = require('app/utils/utils'),

        tpl                 = require('text!tpl/Home.html'),
        
        Handlebars          = require('handlebars-adapter'),
        template = Handlebars.compile(tpl);


    return Backbone.View.extend({

        initialize: function () {
            _.bindAll(this, 'driver_changed', 'driver_changed_temp', 'driver_canceled');
            // this.employeeList = new models.EmployeeCollection();
            // console.log(this.model.attributes);

            this.lastTrip = new models.TripCollection([],{car_id: this.model.attributes._id});
            this.carList = new models_cars.CarCollection();
            this.driverList = new models_drivers.DriverCollection();
            

            this.model.on("reset", this.render, this); 
            this.model.on("sync", this.render, this); 
            // this.model.on("reset", function(){
            //     console.log('reset1');
            // }, this); 
            // this.model.on("sync", function(){
            //     console.log('sync1');
            // }, this); 
            this.model.fetch({ prefill: true });
            console.log(this.model);

            this.render(true);

        },

        events: {
            // "keyup .search-key":    "search",
            // "keypress .search-key": "onkeypress"
            'click .normal-tab-button-bar button' : 'toggle_tabs',

            'click .indicator-toggle-holder' : 'btnswitch',
            'click .quick_running_status' : 'toggle_quickmap',
            'click .quicklink' : 'quicklink',

            'click .quick_keys' : 'give_keys_default_driver',
            'click .quick-keys-link' : 'give_keys_temp',

            // 'click .home_top' : 'slide_menu_right'
            'swipeleft .scroller' : 'slide_menu_right',
            'click .driver-view-button' : 'slide_menu_right',

            'swiperight .scroller' : 'slide_menu',
            'click .car-list-button' : 'slide_menu',

            'click .side-nav .h1_holder' : 'close_slide_menu',
            'swipeleft .side-nav' : 'close_slide_menu',
            'swiperight .side-nav' : 'close_slide_menu',

            'click .button-refresh' : 'refresh_data',

            'click .custom-notification' : 'add_notification' // move to the Notification View soon! 
        },

        render: function (first_time) {
            var that = this;

            if(first_time == true){
                // Builds the outline basically
                this.$el.html(template());
                return this;
            }

            // Write html
            // - expecting a car to come in
            this.$el.html(template({car: this.model.attributes}));

            // replace values
            Utils.dataModelReplace(this);

            // Enable swiping
            Hammer(this.el, {
                swipe_velocity : 0.5
            });

            // if(this.model._pending){
            //     alert('pending');
            // }

            // console.log(JSON.stringify(this.model.attributes));

            // Reverse geocode location
            // if(App.Data.usePg){
            try {
                var latlng = this.model.get('latest_data').lastWaypoint,
                    lat = latlng.latitude,
                    lon = latlng.longitude,
                    latlngString = lat.toString() + ',' + lon.toString();

                $.ajax({
                    url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' +latlngString+ '&sensor=false',
                    headers: {},
                    cache: true,
                    success: function(result){
                        // console.info('maps results');
                        // console.log(result);
                        // console.log(JSON.stringify(result));
                        // alert($.trim(result.results[0].formatted_address));
                        that.$('.city_name').text($.trim(result.results[2].formatted_address).split(',')[0]);
                    }
                });

            } catch(err){
                console.log(err);
            }
        
            // Create subviews
            this.lastTripView = new HomeLastTripView({collection: this.lastTrip, el: $(".last_trip", this.el), parent: this});
            this.carListView = new HomeCarListView({collection: this.carList, el: $(".car-list", this.el)});
            this.driverListView = new HomeDriverListView({collection: this.driverList, el: $(".driver-list", this.el)});

            try {
                var homelatlng = this.model.get('home_gps'),
                    homelat = homelatlng.latitude,
                    homelon = homelatlng.longitude,
                    homelatlngString = homelat.toString() + ',' + homelon.toString();

                    // Run haversine formula
                    var toRad = function(val) {
                       return val * Math.PI / 180;
                    };

                    var lat2 = homelat; 
                    var lon2 = homelon;
                    var lat1 = lat;
                    var lon1 = lon;

                    var R = 3959; // km=6371. mi=3959

                    //has a problem with the .toRad() method below.
                    var x1 = lat2-lat1;
                    var dLat = toRad(x1);
                    var x2 = lon2-lon1;
                    var dLon = toRad(x2);
                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                                    Math.sin(dLon/2) * Math.sin(dLon/2);  
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                    var d = R * c; 

                    if(d > 0.1){
                        that.$('.distance_from_home').removeClass('nodisplay').text('' + d.toFixed(1).toString() + ' mi from home');
                    }

            } catch(err){
                console.log('Failed distance from home calculation');
            }

            return this;
        },

        refresh_data: function(ev){
            this.model.fetch({ prefill: true, reset: true });

            this.carListView.collection.fetch({reset: true});
            return false;
        },

        add_notification: function(ev){
            // Notifications currently disabled
            alert('Notification not yet available...but cool doe, right?');
            return false;
        },

        give_keys_default_driver: function(ev){
            var that = this;

            // Slide to the change screen for the driver
            that.previousPage = window.location.hash;

            // // Change history (must)
            Backbone.history.navigate('driverselect2', {trigger: true, replace: true});

            // Slide page
            App.slider.slidePage(new DriverSelectView({
                selected_drivers: this.model.get('riders') ? this.model.get('riders') : [],
                on_choose: that.driver_changed,
                on_cancel: that.driver_canceled,
                title: 'Select Default',
                back_to_default_hint: false
            }).$el);

            return false;
        },

        give_keys_temp: function(ev){
            var that = this;

            // Slide to the change screen for the driver
            that.previousPage = window.location.hash;

            // // Change history (must)
            Backbone.history.navigate('driverselect2', {trigger: true, replace: true});

            // Slide page
            App.slider.slidePage(new DriverSelectView({
                selected_drivers: this.model.get('temp_riders') ? this.model.get('temp_riders') : [],
                on_choose: that.driver_changed_temp,
                title: 'Select Temp Riders',
                back_to_default_hint: true
            }).$el);

            return false;
        },

        driver_canceled: function(ev){
            var that = this;
            // App.slider.slidePage(App.slider.lastPage);
            Backbone.history.navigate(that.previousPage, {trigger: true});
        },

        driver_changed: function(selected_drivers_list){
            var that = this;

            console.log('Selected drivers');
            console.log(selected_drivers_list);

            if(selected_drivers_list.length > 0){
                that.model.save({'driver_id' : selected_drivers_list[0]._id, 'riders' : selected_drivers_list})
                    .done(function(){
                        // done?
                        // console.info('DONEDONEDONEDONE');
                        Backbone.history.navigate(that.previousPage, {trigger: true});
                    });
            }

            // // // Re-display this page
            // // App.slider.slidePage(this.options.parent.$el);
            // // this.options.parent.render();
            // Backbone.history.navigate(that.previousPage, {trigger: true, replace: true});
            // // this.model.fetch();
        },

        driver_changed_temp: function(selected_drivers_list){
            var that = this;

            console.log('Selected drivers');
            console.log(selected_drivers_list);

            if(selected_drivers_list.length > 0){
                that.model.save({'temp_riders' : selected_drivers_list})
                    .done(function(){
                        // done?
                        // console.info('DONEDONEDONEDONE');
                        Backbone.history.navigate(that.previousPage, {trigger: true});
                    });
            } else {
                // Switching to no sharing!
                that.model.save({'temp_riders' : []})
                    .done(function(){
                        Backbone.history.navigate(that.previousPage, {trigger: true});
                    });
            }

            // // // Re-display this page
            // // App.slider.slidePage(this.options.parent.$el);
            // // this.options.parent.render();
            // Backbone.history.navigate(that.previousPage, {trigger: true, replace: true});
            // // this.model.fetch();
        },

        slide_menu: function(e){
            var cl = this.el.classList;

            this.carListView.collection.fetch({reset: true});

            if (cl.contains('left-nav')) {
                cl.remove('left-nav');
            } else {
                cl.add('left-nav');
            }
            // this.$el.addClass('show-multi-select');
        },

        slide_menu_right: function(e){
            // var cl = this.el.classList;
            // if (cl.contains('right-nav')) {
            //     cl.remove('right-nav');
            // } else {
            //     cl.add('right-nav');
            // }
            // // this.$el.addClass('show-multi-select');

            Backbone.history.loadUrl('driver', {trigger: true, replace: true});

        },

        close_slide_menu: function(e){
            var cl = this.el.classList;
            cl.remove('right-nav');
            cl.remove('left-nav');
        },

        search: function (event) {
            var key = $('.search-key').val();
            this.employeeList.fetch({cache: true, reset: true, data: {name: key}});
        },

        onkeypress: function (event) {
            if (event.keyCode === 13) { // enter key pressed
                event.preventDefault();
            }
        },

        btnswitch: function(ev){
            // var elem = ev.currentTarget;
            // if($(elem).hasClass('toggle-on')){
            //     $(elem).removeClass('toggle-on');
            //     $(elem).addClass('toggle-off');
            // } else {
            //     $(elem).removeClass('toggle-off');
            //     $(elem).addClass('toggle-on');
            // }
        },

        toggle_quickmap: function(ev){
            var pos = this.$('.last_gps_pos');
            if(pos.css('display') == 'none'){
                pos.slideDown('fast');
            } else {
                pos.slideUp('fast');
            }
        },

        swipeControl: function(e){
            alert('1');
            alert(e.direction);
        },

        toggle_tabs: function(ev){
            // Show/hide the trip map
            var elem = ev.currentTarget;

            if($(elem).hasClass('active')){
                // already active!
                return false;
            }

            // Changing tabs

            // Get target
            var target = $(elem).attr('data-tab-target');

            // Hide all tabs
            this.$('.tabs_holder .tab').addClass('nodisplay');

            // Show this corresponding tab
            this.$('.tabs_holder .tab.' + target).removeClass('nodisplay');            

            // Make all buttons inactive
            this.$('.normal-tab-button-bar button').removeClass('active');

            // Make this button active
            $(elem).addClass('active');


            // if($mapHolder.hasClass('nodisplay')){
            //     $(elem).html('View Map');
            //     $mapHolder.removeClass('nodisplay');
            // } else {
            //     $(elem).html('Hide Map');
            //     $mapHolder.addClass('nodisplay');
            // }
        }

    });

});
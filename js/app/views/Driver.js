define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Driver.html'),

        HomeDriverListView     = require('app/views/HomeDriverList'),

        Hammer              = require('hammer'),

        utilsLib            = require('app/utils/utils'),
        Utils               = new utilsLib(),

        models              = require('app/models/driver'),
        tripModel           = require('app/models/trip'),

        DriverTripView      = require('app/views/DriverTrip'),
        DriverBillView      = require('app/views/DriverBill'),

        Handlebars          = require('handlebars'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {

            this.driverList = new models.DriverCollection();

            this.model.on('reset', this.render, this);
            this.model.on('change', this.render, this);
            this.model.fetch({prefill: true, reset: true});
            
            this.driverTrips = new tripModel.TripCollection([],{driver_id : this.model.get('_id')}); // never pass anything to a collection!
            // this.driverTrips.driver_id = this.model.get('_id');

            this.render();
        },

        events: {
            'click .normal-tab-button-bar button' : 'toggle_tabs',

            'click .button-refresh' : 'refresh_data',

            'swipeleft .scroller' : 'slide_menu_right',
            'swiperight .scroller' : 'car_home',

            'click .driver-view-button' : 'slide_menu_right',
            'click .car-view-button' : 'car_home',

            'click .side-nav .h1_holder' : 'close_slide_menu',
            'swipeleft .side-nav' : 'close_slide_menu',
            'swiperight .side-nav' : 'close_slide_menu'
        },

        render: function () {
            // this.$el.html(template());
            var that = this;

            this.$el.html(template({
                driver: this.model.attributes
            }));

            // Enable swiping
            Hammer(this.el);
            
            // replace values
            Utils.dataModelReplace(this);

            // Create subview(s):

            // Driver List right subview
            this.driverListView = new HomeDriverListView({collection: this.driverList, el: $(".driver-list", this.el)});

            // Trips subview
            this.driverTripView = new DriverTripView({collection: this.driverTrips, model: this.model, el: $(".tab-legs", this.el)});

            // Costs or bills?
            this.driverBillView = new DriverBillView({model: this.model, el: $(".tab-costs", this.el)});


            // Display menu if no Driver yet chosen as default
            // - for blank lists
            if(!this.model.get('_id')){
                // No driver
                // - display menu
                window.setTimeout(function(){
                    that.$('.scroller').trigger('swipeleft');
                },1);
            }

            return this;
        },

        refresh_data: function(ev){

            this.model.fetch({prefill: true, reset: true});
            this.driverTrips.fetch({prefill: true, reset: true}); // auto-knows driver_id to use?

            return false;
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
        },

        car_home: function(e){
            // navigate back to car
            // App.router.slider.force_reverse = true;
            Backbone.history.loadUrl('', {trigger: true, replace: false});
        },

        slide_menu_right: function(e){
            var cl = this.el.classList;
            if (cl.contains('right-nav')) {
                cl.remove('right-nav');
            } else {
                cl.add('right-nav');
            }
            // this.$el.addClass('show-multi-select');

        },

        close_slide_menu: function(e){
            if(!this.model.get('_id')){
                alert('Please choose a driver');
                return false;
            }
            var cl = this.el.classList;
            cl.remove('right-nav');
            cl.remove('left-nav');
        },

    });

});
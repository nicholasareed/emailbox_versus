define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Trip.html'),

        DriverSelectView    = require('app/views/DriverSelect'),

        utilsLib            = require('app/utils/utils'),
        Utils               = new utilsLib(),

        models              = require('app/models/leg'),
        TripCostView        = require('app/views/TripCost'),
        TripBillView        = require('app/views/TripBill'),
        TripLegsView        = require('app/views/TripLeg'),
        TripLegsMapView     = require('app/views/TripLegMap'),

        Handlebars          = require('handlebars'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            _.bindAll(this, 'driver_canceled', 'driver_changed');

            console.log('model.id');
            console.log(this.model.id);


            this.tripLegs = new models.LegCollection(); // never pass anything to a collection!
            this.tripLegs.trip_id = this.model.id;

            this.model.on('change', this.render, this);
            this.model.on('reset', this.render, this);

            this.model.fetch({prefill: true, cache: true, reset: true});
            
            this.render();
        },

        events: {
            'click .driver_change' : 'change_driver',
            'click .normal-tab-button-bar button' : 'toggle_tabs'
        },

        render: function () {
            // this.$el.html(template());
            
            this.$el.html(template({
                trip:this.model.attributes
            }));

            // replace values
            Utils.dataModelReplace(this);

            // Create subview(s):

            // Legs subview
            this.tripLegsView = new TripLegsView({collection: this.tripLegs, el: $(".trip_leg_holder", this.el)});

            // Entire leg map view (single map)
            this.tripLegsMapView = new TripLegsMapView({collection: this.tripLegs, el: $(".trip_map_holder", this.el)});

            // Costs or bills?
            if(this.model.get('billed') == true){
                // Bills subview
                this.tripBillView = new TripBillView({model: this.model, el: $(".costs_holder", this.el)});
            } else {
                // Costs subview
                this.tripCostView = new TripCostView({model: this.model, el: $(".costs_holder", this.el)});
            }

            return this;
        },

        change_driver: function(){
            var that = this;

            // Slide to the change screen for the driver
            that.previousPage = window.location.hash;

            // // Change history (must)
            Backbone.history.navigate('driverselect2', {trigger: true, replace: true});

            // Slide page
            App.slider.slidePage(new DriverSelectView({
                selected_drivers: this.model.get('riders'),
                on_choose: that.driver_changed,
                on_cancel: that.driver_canceled
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
                        Backbone.history.navigate(that.previousPage, {trigger: true, replace: true});
                    });
            }

            // // // Re-display this page
            // // App.slider.slidePage(this.options.parent.$el);
            // // this.options.parent.render();
            // Backbone.history.navigate(that.previousPage, {trigger: true, replace: true});
            // // this.model.fetch();
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
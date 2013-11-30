define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/HomeLastTrip.html'),

        DriverSelectView    = require('app/views/DriverSelect'),

        Utils            = require('app/utils/utils'),
        
        // PageSlider  = require('app/utils/pageslider'),
        // slider = new PageSlider($('body')),

        Handlebars          = require('handlebars-adapter'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            _.bindAll(this, 'driver_canceled', 'driver_changed');
            this.render();
            this.collection.on("reset", this.render, this);
            this.collection.fetch({prefill: true, reset: true}); // force a reset after the fetch
        },

        events: {
            'click .change_driver' : 'change_driver'
        },

        render: function () {
            var that = this;
            this.collection.findByLastTrip()
                .then(function(trip){
                    that.tripModel = trip;
                    var tripJSON = {};
                    if(trip){
                        tripJSON = trip.toJSON();
                    }
                    that.$el.html(template({trip: tripJSON}));
                });

            Utils.dataModelReplace(this);

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
                selected_drivers: this.tripModel.get('riders'),
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
                that.tripModel.save({'driver_id' : selected_drivers_list[0]._id, 'riders' : selected_drivers_list})
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



        // change_driver: function(){
        //     var that = this;

        //     // Slide to the change screen for the driver
        //     that.previousPage = window.location.hash;
        //     Backbone.history.navigate('driverselect2', {trigger: true, replace: true});
        //     App.slider.slidePage(new DriverSelectView({
        //         on_choose: that.driver_changed,
        //         on_cancel: that.driver_canceled
        //     }).$el);

        //     return false;
        // },

        // driver_canceled: function(ev){
        //     var that = this;
        //     // App.slider.slidePage(App.slider.lastPage);
        //     Backbone.history.navigate(that.previousPage, {trigger: true});
        // },

        // driver_changed: function(ev){
        //     var that = this;
        //     // alert($(ev.currentTarget).attr('data-id'));
        //     // App.slider.slidePage(App.slider.lastPage);

        //     // console.log('tripModel');
        //     // console.log(that.tripModel);
        //     that.tripModel.save('driver_id' , $(ev.currentTarget).attr('data-id'));
        //     // console.log('sync');

        //     // // Re-display this page
        //     // App.slider.slidePage(this.options.parent.$el);
        //     // this.options.parent.render();
        //     Backbone.history.navigate(that.previousPage, {trigger: true});
        // }

    });

});



function slugToCamel(slug) {
    var words = slug.split('_');

    for(var i = 0; i < words.length; i++) {
      var word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }

    return words.join(' ');
}
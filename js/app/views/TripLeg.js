define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/TripLeg.html'),

        utilsLib            = require('app/utils/utils'),
        Utils               = new utilsLib(),
        
        Handlebars          = require('handlebars-adapter'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();
            this.collection.on("reset", this.render, this);
            this.collection.fetchbyTrip(); // force a reset after the fetch
        },

        events: {
            'click .view_leg_map' : 'view_leg_map'
        },

        render: function () {
            var that = this;
            // this.collection.findByLastTrip()
            //     .then(function(trip){
            //         if(trip){
            //             trip = trip.toJSON();
            //         }
            //         that.$el.html(template({trip: trip}));
            //     });
            that.$el.html(template({
                trips: this.collection.toJSON(),
                mapWidth: $('body').width()
            }));

            return this;
        },

        view_leg_map: function(ev){
            var elem = ev.currentTarget;

            console.log(1);
            // Show/Hide map for leg
            var $parent = $(elem).parents('.leg_view_map_holder'),
                $map = $parent.find('.leg_map');

            if($map.hasClass('nodisplay')){
                $(elem).text('Hide Map');
                $map.removeClass('nodisplay');
            } else {
                $(elem).text('Show Map');
                $map.addClass('nodisplay');
            }

            console.log(2);

            return false;

        }

    });

});
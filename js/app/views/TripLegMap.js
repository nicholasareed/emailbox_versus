define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/TripLegMap.html'),

        utilsLib            = require('app/utils/utils'),
        Utils               = new utilsLib(),

        Handlebars          = require('handlebars-adapter'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();
            this.collection.on("reset", this.render, this);
            // this.collection.fetchbyTrip(); // force a reset after the fetch
        },

        events: {
            
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

            var map_static_url = Utils.getGoogleMapsStaticUrlForTrip(this.collection.toJSON());

            that.$el.html(template({
                src: map_static_url
            }));

            return this;
        }

    });

});
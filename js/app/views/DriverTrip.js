define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/DriverTrip.html'),

        models              = require('app/models/trip'),

        utilsLib            = require('app/utils/utils'),
        Utils               = new utilsLib(),
        
        Handlebars          = require('handlebars-adapter'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();

            // Get bills for this trip

            // this.collection = new models.TripCollection(); // never pass anything to a collection!
            // this.collection.driver_id = this.model.id;

            this.collection.on("reset", this.render, this);
            this.collection.fetch({prefill: true, cache: true, reset: true}); // auto-knows driver_id to use?

            this.render();


            // this.collection.fetchbyTrip(); // force a reset after the fetch
        },

        events: {
            'click .quicklink' : 'quicklink'
        },

        render: function () {
            var that = this;

            if(this.collection){   
                that.$el.html(template({
                    trips: this.collection.toJSON(),
                    driver: this.model.attributes
                }));
            }

            // replace values
            Utils.dataModelReplace(this);

            return this;
        }

    });

});
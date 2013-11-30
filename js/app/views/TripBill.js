define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/TripBill.html'),

        models              = require('app/models/bill'),

        utilsLib            = require('app/utils/utils'),
        Utils               = new utilsLib(),
        
        Handlebars          = require('handlebars-adapter'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();

            // Get bills for this trip

            this.collection = new models.BillCollection(); // never pass anything to a collection!
            this.collection.trip_id = this.model.id;

            this.collection.on("reset", this.render, this);

            this.collection.fetchForTrip();

            this.render();


            // this.collection.fetchbyTrip(); // force a reset after the fetch
        },

        events: {

            'click .pay-button' : 'pay_button'
            
        },

        render: function () {
            var that = this;
            // console.log(this.model);

            if(this.collection && this.collection.length){
                that.$el.html(template({
                    bills: this.collection.toJSON(),
                    trip: this.model.attributes
                }));
            }

            // replace values
            Utils.dataModelReplace(this);

            return this;
        },

        pay_button: function(ev){
            var elem = ev.currentTarget,
                that = this;

            // $(elem).attr('disabled','disabled');
            $(elem).text('Please wait...');

            this.model.payBills()
                .then(function(){
                    // Complete!
                    $(elem).text('Refreshing...');

                    // Change the display
                    // - tell our parent to get rid of this subview (change it out when updated)
                    that.model.fetch({reset: true});

                });

        }

    });

});
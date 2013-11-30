define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/DriverBill.html'),

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
            this.collection.driver_id = this.model.id;

            this.collection.on("reset", this.render, this);

            this.collection.fetchForDriver();

            this.render();


            // this.collection.fetchbyTrip(); // force a reset after the fetch
        },

        events: {
            'click .pay-bill' : 'pay_bill',
            'click .toggler' : 'toggle_showbill',
            'click .quicklink' : 'quicklink'
        },

        render: function () {
            var that = this;

            if(this.collection && this.collection.length){
                that.$el.html(template({
                    bills: this.collection.toJSON(),
                    driver: this.model.attributes
                }));
            }

            // replace values
            Utils.dataModelReplace(this);

            return this;
        },

        toggle_showbill: function(ev){
            var elem = ev.currentTarget,
                $item = $(elem).parent(),
                that = this;

            // Show/hide the tabs for this person
            if($item.hasClass('show-toggle')){
                $item.removeClass('show-toggle')
            } else {
                $item.addClass('show-toggle')
            }

            return false;
        },

        pay_bill: function(ev){
            var elem = ev.currentTarget,
                $item = $(elem).parents('.driver-cost-list-item'),
                that = this;

            // Already paid?
            if($item.attr('data-paid') == "1"){
                alert('Already marked as paid!');
                return false;
            }

            // Change text
            $item.find('.paid-third').text('Wait..');

            // Get model from collection
            var billModel = that.collection.get($item.attr('data-bill-id'));

            console.log('billModel');
            console.log(billModel);

            if(!billModel){
                // shoot
                alert('Failed finding bill model');
                return false;
            }

            // Try and mark as paid
            billModel.pay()
                .then(function(){
                    // Complete!
                    $item.find('.paid-third').text('Wait....');

                    // Change the display
                    // - tell our parent to get rid of this subview (change it out when updated)
                    that.collection.fetchForDriver();

                });


        }

    });

});
define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/CarList.html'),

        models              = require('app/models/car'),

        Handlebars          = require('handlebars'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.collection = new models.CarCollection();
            this.render();
            this.collection.on("reset", this.render, this);
            this.collection.fetch({prefill: true, reset: true, data: {}});
        },

        events: {
            'click .quicklink' : 'quicklink',
            'click .add-car' : 'add_car'
            // 'click .error-code' : 'view_errorcode'
        },

        render: function () {
            this.$el.html(template({
                cars: this.collection.toJSON()
            }));
            return this;
        },

        add_car: function(){
            // Give info on adding a car?
            alert('Information on connecting a vehicle to Wehicle will be forthcoming');

            return false;
        }

    });

});
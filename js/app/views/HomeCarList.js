define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/HomeCarList.html'),
        
        Handlebars          = require('handlebars-adapter'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();
            this.collection.on("reset", this.render, this);
            this.collection.fetch({prefill: true, reset: true}); // force a reset after the fetch
        },

        events: {
            'click .car-item' : 'car_item'
        },

        render: function () {
            var that = this;
            that.$el.html(template({cars: this.collection.toJSON()}));
            return this;
        },

        car_item: function(ev){
            var elem = ev.currentTarget;

            var id = $(elem).attr('data-id');

            Backbone.history.navigate('home/' + id, {trigger: true});
        }

    });

});
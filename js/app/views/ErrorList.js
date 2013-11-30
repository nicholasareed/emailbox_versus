define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/ErrorList.html'),

        models              = require('app/models/error'),

        Handlebars          = require('handlebars'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.collection = new models.ErrorCollection([], {car_id: this.options.car_id});
            this.render();
            this.collection.on("reset", this.render, this);
            this.collection.fetch({cache: true, reset: true, data: {}});
        },

        events: {
            'click .quicklink' : 'quicklink',

            // 'click .error-code' : 'view_errorcode'
        },

        render: function () {
            this.$el.html(template({
                errors: this.collection.toJSON()
            }));
            return this;
        },

        view_errorcode: function(ev){
            var elem = ev.currentTarget;

            var url = 'http://www.obd-codes.com/' + $(elem).attr('error-code');
            alert(url);
            var ref = window.open(url, '_blank', 'location=yes');
        }

    });

});
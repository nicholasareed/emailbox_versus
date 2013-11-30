define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/SettingsCarList.html'),

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

            // 'click .error-code' : 'view_errorcode'
        },

        render: function () {
            this.$el.html(template({
                cars: this.collection.toJSON()
            }));
            return this;
        }

    });

});
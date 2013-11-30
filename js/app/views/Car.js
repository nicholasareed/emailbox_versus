define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Car.html'),

        Handlebars          = require('handlebars'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            // this.$el.html(template());
            this.$el.html(template({car:this.model.attributes}));

            return this;
        }

    });

});
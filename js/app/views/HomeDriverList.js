define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/HomeDriverList.html'),
        
        Handlebars          = require('handlebars-adapter'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();
            this.collection.on("reset", this.render, this);
            this.collection.fetch({prefill: true, reset: true}); // force a reset after the fetch
        },

        events: {
            'click .quicklink' : 'quicklink'
        },

        render: function () {
            var that = this;
            that.$el.html(template({drivers: this.collection.toJSON()}));
            return this;
        }

    });

});
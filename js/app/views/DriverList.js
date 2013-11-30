define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/DriverList.html'),

        models              = require('app/models/driver'),

        Handlebars          = require('handlebars'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.collection = new models.DriverCollection();
            this.render();
            this.collection.on("reset", this.render, this);
            this.collection.fetch({prefill: true, reset: true, data: {}});
        },

        events: {
            'click .quicklink' : 'quicklink',

            'click .add-driver' : 'add_driver'
            // 'click .error-code' : 'view_errorcode'
        },

        render: function () {
            this.$el.html(template({
                drivers: this.collection.toJSON()
            }));
            return this;
        },

        add_driver: function(ev){
            alert('drivers not yet add-able');
            return false;
        }

    });

});
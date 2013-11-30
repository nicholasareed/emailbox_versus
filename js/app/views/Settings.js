define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Settings.html'),

        Handlebars          = require('handlebars'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        events: {
            'click .quicklink' : 'quicklink',

            'click .action-sign-out' : 'signout'
        },

        render: function () {
            this.$el.html(template());
            return this;
        },

        signout: function(){
            // confirm, then signout
            var r = confirm("Sure you want to Sign Out?");
            if (r == true){
                Backbone.history.navigate('logout', {trigger: true});
            }
            return false;
        }

    });

});
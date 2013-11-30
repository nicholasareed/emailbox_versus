define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Error.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        events: {
            'click .quicklink' : 'quicklink',

            'click .error-code' : 'view_errorcode'
        },

        render: function () {
            var that = this;

            this.$el.html(template());

            that.$('.error-detail-page').html('<p class="loading">loading...</p>');

            var url = 'http://www.obd-codes.com/' + this.options.errorCode;
            $.ajax({
                url: url,
                cache: false,
                success: function(htmlResponse){
                    // Phonegap doesn't have cross-domain issues! 
                    var $data = $(htmlResponse).find('.KonaBody');
                    $data.find('script').remove();
                    that.$('.error-detail-page').html(
                        $data
                    );
                },
                error: function(){
                    alert('error');
                }
            });

            return this;
        },

        view_errorcode: function(ev){
            var elem = ev.currentTarget;

            var url = 'http://www.obd-codes.com/' + this.options.errorCode;
            var ref = window.open(url, '_blank', 'location=yes');
        }

    });

});
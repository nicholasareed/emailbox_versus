define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/TripList.html'),

        utilsLib            = require('app/utils/utils'),
        Utils               = new utilsLib(),

        models              = require('app/models/trip'),

        Handlebars          = require('handlebars'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();
            this.collection.on("reset", this.render, this);
            this.collection.fetch({prefill: true, reset: true, data: {}});
        },

        events: {
            'click .quicklink' : 'quicklink',

            'click .quick-refresh' : 'refresh',

            'click .filter_holder .left_item div' : 'show_time',
            'click .filter_holder .right_item div' : 'show_feature',
            'click .filter_holder .middle_item div' : 'show_driver',
            'click .time_list li' : 'chose_time',
            'click .feature_list li' : 'chose_feature',
            'click .driver_list_switch li' : 'chose_driver'
        },

        render: function () {
            // console.log(this.collection.toJSON());

            this.$el.html(template({
                model_id: this.collection.options.car_id ? this.collection.options.car_id : this.collection.options.driver_id ,
                trips: this.collection.toJSON()
            }));

            // replace values
            Utils.dataModelReplace(this);

            // Update summary values
            var tmp1 = _.map(this.collection.toJSON(),function(tmp){
                return tmp.miles;
            });
            var tmp2 = _.reduce(tmp1, function(list, item){
                return list + item;
            }, 0);
            
            var val = tmp2.toFixed(1);
            this.$('.measure').text($.trim(val.toString()));


            return this;
        },

        refresh: function(ev){
            var elem = ev.currentTarget;

            this.collection.fetch({prefill: true, reset: true, data: {}});
            return false;
        },

        show_time: function(ev){
            var elem = ev.currentTarget;
            if($(elem).hasClass('active')){
                $(elem).removeClass('active');
                this.$('.topcoat-list').addClass('nodisplay');
                this.$('.topcoat-list.trips').removeClass('nodisplay');
            } else {
                $(elem).addClass('active');
                this.$('.topcoat-list').addClass('nodisplay');
                this.$('.topcoat-list.time_list').removeClass('nodisplay');
            }

        },

        show_driver: function(ev){
            var elem = ev.currentTarget;
            if($(elem).hasClass('active')){
                $(elem).removeClass('active');
                this.$('.topcoat-list').addClass('nodisplay');
                this.$('.topcoat-list.trips').removeClass('nodisplay');
            } else {
                $(elem).addClass('active');
                this.$('.topcoat-list').addClass('nodisplay');
                this.$('.topcoat-list.driver_list_switch').removeClass('nodisplay');
            }

        },

        show_feature: function(ev){
            var elem = ev.currentTarget;
            if($(elem).hasClass('active')){
                $(elem).removeClass('active');
                this.$('.topcoat-list').addClass('nodisplay');
                this.$('.topcoat-list.trips').removeClass('nodisplay');
            } else {
                $(elem).addClass('active');
                this.$('.topcoat-list').addClass('nodisplay');
                this.$('.topcoat-list.feature_list').removeClass('nodisplay');
            }

        },

        chose_time: function(ev){
            // just as if we clicked off the show_time button
            var elem = this.$('.filter_holder .left_item div');
            $(elem).removeClass('active');
            this.$('.topcoat-list').addClass('nodisplay');
            this.$('.topcoat-list.trips').removeClass('nodisplay');

            $(elem).text($.trim($(ev.currentTarget).text()));

            return false;
        },

        chose_feature: function(ev){
            // just as if we clicked off the show_time button
            var elem = this.$('.filter_holder .right_item div');
            $(elem).removeClass('active');
            this.$('.topcoat-list').addClass('nodisplay');
            this.$('.topcoat-list.trips').removeClass('nodisplay');

            $(elem).text($.trim($(ev.currentTarget).text()));

            return false;
        },

        chose_driver: function(ev){
            // just as if we clicked off the show_time button
            var elem = this.$('.filter_holder .middle_item div');
            $(elem).removeClass('active');
            this.$('.topcoat-list').addClass('nodisplay');
            this.$('.topcoat-list.trips').removeClass('nodisplay');

            $(elem).text($.trim($(ev.currentTarget).text()));

            return false;
        }

    });

});
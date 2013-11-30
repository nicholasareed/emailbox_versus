define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/CarEdit.html'),

        Handlebars          = require('handlebars'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            _.bindAll(this, 'default_input_label_values');

            this.model.on('sync', this.render, this);
            this.model.fetch({prefill: true, reset: true});

            this.render(true);
        },

        events: {

            'keyup input[type="text"]' : 'input_keyup',
            'keyup select' : 'input_keyup',
            'blur input[type="text"]' : 'input_blur',
            'blur select' : 'input_blur',
            'focus input[type="text"]' : 'input_focus',
            'focus select' : 'input_focus',

            'change select' : 'input_blur',

            'click .submit-button' : 'saveit'

        },

        render: function (first_time) {
            var that = this;

            // this.$el.html(template());
            if(first_time == true){
                this.$el.html(template());
                return this;
            }

            try{
                var name = this.model.get('name');
                if(!name || name.length < 1){
                    name = this.model.toJSON().latest_data.name;
                    this.model.set({name: name});
                }
            } catch(err){
                // no catch
            }

            this.$el.html(template({car:this.model.attributes}));

            // // Trigger key_up for each input element
            // this.$('select').each(function(){
            //     // $(this).focus();
            //     $(this).trigger('touchend');
            // });

            this.default_input_label_values();

            return this;
        },

        changes: function(){
            // handles Save events?
        },

        saveit: function(ev){
            var elem = ev.currentTarget,
                that = this;

            // disable submit
            $(elem).attr('previous-text',$(elem).text()).text('Saving...');
            $(elem).attr('disabled','disabled');

            // Get elements to save

            var info = this.model.toJSON().info || {};


            // Update model
            this.model.set({
                name : that.$('[name="name"]').val(),
                condition : that.$('[name="condition"]').val(),
                tank_size : that.$('[name="tank_size"]').val(),
                fuel_type : that.$('[name="fuel_type"]').val(),
                mpg : that.$('[name="mpg"]').val()
            });
            console.log(this.model.toJSON());

            // Save model
            this.model.save()
                .then(function(){
                    
                    // Enable submit
                    $(elem).attr('disabled',false);
                    $(elem).text( $(elem).attr('previous-text') );

                    // Leave page
                    that.$('.back-button').trigger('click');

                    // Reset cache
                    App.Data.Cache.ModelReplacers = {};

                });

            return false;
        },

        default_input_label_values: function(){
            // Iterates over input values and updates accordingly
            this.$('input[type="text"],select').each(function(){

                var $parent = $(this).parent();

                if( $(this).val() == '' ) {
                    // $parent.addClass('js-hide-label'); // mobile auto-hides the placeholder!
                } else {
                    $parent.removeClass('js-hide-label').addClass('js-unhighlight-label');;
                }
            });
        },

        input_keyup: function(ev){
            var elem = ev.currentTarget,
                that = this;

            var $parent = $(elem).parent();

            if( $(elem).val() == '' ) {
                // $parent.addClass('js-hide-label'); // mobile auto-hides the placeholder!
            } else {
                $parent.removeClass('js-hide-label');
            }

        },

        input_blur: function(ev){
            var elem = ev.currentTarget,
                that = this;

            var $parent = $(elem).parent();

            if( $(elem).val() == '' ) {
                $parent.addClass('js-hide-label');
            }
            else {
                $parent.removeClass('js-hide-label').addClass('js-unhighlight-label');
            }

        },

        input_focus: function(ev){
            var elem = ev.currentTarget,
                that = this;

            var $parent = $(elem).parent();

            if( $(elem).val() !== '' ) {
                $parent.removeClass('js-unhighlight-label');
            }
            $parent.removeClass('js-hide-label');

        }

    });

});
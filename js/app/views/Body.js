define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),

        models              = require('app/models/email'),

        Hammer              = require('hammer'),

        Utils               = require('utils'),
        Api                 = require('api'),

        tpl                 = require('text!tpl/Body.html'),
        
        Handlebars          = require('handlebars-adapter'),
        template = Handlebars.compile(tpl);


    return Backbone.View.extend({

        initialize: function () {
            var that = this;

            // this.model.on("reset", this.render, this); 
            // this.model.on("sync", this.render, this); 
            this.collection = new models.EmailCollection();
            this.collection.on('updateRemoteCount', this.render, this);
            this.collection.remoteCount();

            // Listen for new emails to change the board
            Api.Event.on({
                event: ['Email.new','Email.send']
            },function(event){
                that.collection.remoteCount();
            });

            this.render(true);

        },

        events: {
            'click .signout-button' : 'logout',
            'click .challenge-button' : 'challenge',
            'click .trigger-refresh' : 'refresh_data'
        },

        render: function (first_time) {
            var that = this;

            if(first_time == true){
                // Builds the outline basically
                this.$el.html(template());

                that.od = new Odometer({
                  el: that.$('#odometer').get(0)

                  // Any option (other than auto and selector) can be passed in here
                  // format: '',
                  // theme: 'plaza'
                });

                // setTimeout(function(){
                //     that.od.update(900);
                // }, 2000);

                return this;
            }

            // Update values
            that.od.update( this.collection.remoteCountVal );

            // // Write html
            // // - expecting a car to come in
            // this.$el.html(template({}));

            // // Enable swiping
            // Hammer(this.el, {
            //     swipe_velocity : 0.5
            // });


            return this;
        },

        refresh_data: function(ev){
            this.collection.remoteCount();
            return false;
        },

        logout: function(ev){
            var r = confirm('OK to log out?');
            if(r == true){
                Backbone.history.navigate('logout',{trigger: true});
            }
            return false;
        },

        challenge: function(ev){
            alert('Challenges coming in v2');
            return false;
        }

    });

});
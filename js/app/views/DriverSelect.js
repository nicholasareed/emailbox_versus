define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),

        models              = require('app/models/driver'),

        Utils            = require('app/utils/utils'),

        tpl                 = require('text!tpl/DriverSelect.html'),
        tplDriverLeft       = require('text!tpl/DriverSelectLeft.html'),
        Handlebars          = require('handlebars'),
        template            = Handlebars.compile(tpl),
        templateDriverLeft  = Handlebars.compile(tplDriverLeft);

    return Backbone.View.extend({

        initialize: function () {
            _.bindAll(this, 'rerender_selected');

            this.selected_drivers = this.options.selected_drivers || [];

            this.collection = new models.DriverCollection();
            this.collection.on("reset", this.render, this); // MUST be calling it at some point?
            this.collection.fetch({prefill: true, reset: true, data: {}});

            // this.render();

            this.options = _.extend({
                title: 'Select Riders',
                back_to_default_hint: true
            }, this.options || {});


            // Should be passing in the current roster/seats too...
            // - todo...compare against existing

        },

        events: {
            'click .driver-item' : 'driver_item',
            'click .clear_at_top' : 'clear_list',
            'click .back-button' : 'back',
            'click .save-button' : 'save_drivers',
            'click .driver-item-chosen:not(.empty-item)' : 'driver_item' //_chosen'
        },

        render: function () {
            this.$el.html(template({
                drivers: this.collection.toJSON(),
                options: this.options
            }));

            this.rerender_selected();

            return this;
        },

        back: function(ev){
            if(this.options.on_cancel){
                this.options.on_cancel(ev);
                return false;
            }
        },

        save_drivers: function(ev){
            // Return contents to calling function
            if(this.options.on_choose){
                this.options.on_choose(this.selected_drivers);
            }
            return false;

        },

        clear_list: function(ev){
            // Mark all as inactive, remove from the left side
            // - re-render

            this.selected_drivers = [];
            this.$('.driver_item').removeClass('active');
            this.$('.driver-item[data-id]').removeClass('active');
            this.rerender_selected();

            return false;
        },

        rerender_selected: function(){
            // Take selected drivers and display them in the left-list
            // - includes displaying names correctly
            var that = this;

            // Get list element
            var $list = this.$('.keys-left-list');

            // If empty, then add me as the default?
            if(this.selected_drivers.length < 1){
                // alert('No drivers!');
            }

            // Convert selected_drivers into model objects from this collection
            // - should/must have all the driver info

            var tmp_drivers = _.map(this.selected_drivers, function(driver){

                // console.log('ITEM');
                // console.log(item);
                console.log(driver);
                return that.collection.get(driver._id).toJSON();
            });

            // console.info('tmp_drivers');
            // console.info(tmp_drivers);

            var empty = 10 - tmp_drivers.length;

            $list.html(templateDriverLeft({
                empty: empty,
                people: tmp_drivers
            }));

            // Highlight correct ones
            that.collection.each(function(model){
                // console.log(model.toJSON());
                var tmp_id = model.get('_id');
                if(_.contains(that.selected_drivers, tmp_id)){
                    that.$('.driver-item[data-id="'+tmp_id+'"]').addClass('active');
                } else {
                    // not active
                    that.$('.driver-item[data-id="'+tmp_id+'"]').removeClass('active');
                }
            });
            

            // Re-delegate events
            // - should be using a completely new View...
            this.delegateEvents();

            // window.scrollTo(0,0);

            // this.$el.addClass('testing');
            // this.$el.removeClass('testing');

            // console.log(this.$el.offsetWidth); // force reflow
            // console.log(this.$('.right-static').offsetWidth);

        },

        driver_item: function(ev){
            // Updates the selected items
            // - or removes this one, if chosen
            
            var elem = ev.currentTarget,
                id = $(elem).attr('data-id'),
                that = this;

            if(_.contains(_.pluck(that.selected_drivers,'_id'), id)){
                // Remove from the other side and make inactive
                // $(elem).removeClass('active');
                that.selected_drivers = _.reject(that.selected_drivers, function(driver){
                    return driver._id == id;
                });
            } else {
                // Add to selected drivers
                // $(elem).addClass('active');
                that.selected_drivers.push({
                    _id: id,
                    amount: 'even'
                });
            }

            // Re-render the list of drivers and passengers
            this.rerender_selected();

            return false;
        },

        driver_item_chosen: function(ev){
            // Canceling an item
            
            var elem = ev.currentTarget,
                id = $(elem).attr('data-id'),
                that = this;

            if(_.contains(that.selected_drivers, id)){
                // Remove from the other side and make inactive
                // that.$('.driver-item[data-id="'+id+'"]').removeClass('active');
                that.selected_drivers = _.without(that.selected_drivers, id);
            } else {
                // Add to selected drivers
                // that.$('.driver-item[data-id="'+id+'"]').addClass('active');
                that.selected_drivers.push(id);
            }

            // Re-render the list of drivers and passengers
            this.rerender_selected();

            return false;
        }

    });

});
define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/TripCost.html'),

        utilsLib            = require('app/utils/utils'),
        Utils               = new utilsLib(),
        
        Handlebars          = require('handlebars-adapter'),
        template            = Handlebars.compile(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.render();
            // this.collection.on("reset", this.render, this);
            // this.collection.fetchbyTrip(); // force a reset after the fetch
        },

        events: {
            'click .driver-cost-list-item' : 'modify_funds_opener',
            'click .change-amount td' : 'change_funds',

            'click .request-button' : 'request_button'
        },

        render: function () {
            var that = this;
            // console.log(this.model);

            // Bills or still able to choose?
            if(this.model.get('billed') == true){
                // uh oh!
                that.$el.html('<div class="default-empty-list">Expecting Bills... Please Reload</div>');
            } else {
                that.$el.html(template({
                    trips: this.model.toJSON(),
                    drivers_in_trip: this.model.get('riders')
                    // mapWidth: $('body').width()
                }));
            }

            // replace values
            Utils.dataModelReplace(this);

            return this;
        }, 

        modify_funds_opener: function(ev){
            var elem = ev.currentTarget,
                $cost_holder = $(elem),
                $change_amount = $cost_holder.next('.change-amount');

            if($change_amount.hasClass('nodisplay')){
                // Hidden, display it

                // Hide every other one
                this.$('.change-amount').addClass('nodisplay');
                this.$('.driver-cost-list-item').removeClass('active');

                // Mark as active and display
                $cost_holder.addClass('active');
                $change_amount.removeClass('nodisplay');

            } else {
                // Displayed, hide it

                $change_amount.addClass('nodisplay');

                // Mark as inactive
                $cost_holder.removeClass('active');

            }

            return false;

        },

        change_funds: function(ev){
            // Change the billing percentage for a person
            // - update the html
            var elem = ev.currentTarget;

            console.log(elem);

            var that = this,
                $change_amount = $(elem).parents('.change-amount'),
                $change_amount_table = $(elem).parents('.change-amount-table'),
                $cost_holder = $change_amount.prev('.driver-cost-list-item'),
                driver_id = $cost_holder.attr('data-driver-id'),
                $person_fund_holder = $cost_holder.find('.person-fund-amount'),
                amount = $(elem).attr('display-amount');

            // Update HTML
            $person_fund_holder.find('span').html( $(elem).attr('display-amount') );
            $person_fund_holder.attr('data-amount', $(elem).attr('display-amount'));
            $change_amount_table.attr('display-amount', $(elem).attr('display-amount'));

            // Update data
            // - save?
            var riders = this.model.get('riders');
            riders = _.map(riders, function(rider){
                if(rider._id == driver_id){
                    rider.amount = amount;
                }
                return rider;
            });

            console.log(riders);

            this.model.set({riders: riders});
            this.model.save();

            // Hide choosers
                // Hide every other one
            this.$('.change-amount').addClass('nodisplay');
            this.$('.driver-cost-list-item').removeClass('active');

            return false;

        },

        request_button: function(ev){
            var elem = ev.currentTarget,
                that = this;

            // $(elem).attr('disabled','disabled');
            $(elem).text('Please wait...');

            this.model.requestFunds()
                .then(function(){
                    // Complete!
                    $(elem).text('Refreshing...');

                    // Change the display
                    // - tell our parent to get rid of this subview (change it out when updated)
                    that.model.fetch({reset: true});

                });

        }

    });

});
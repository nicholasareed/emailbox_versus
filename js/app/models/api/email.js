define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Api                 = require('api'),

        Email = Backbone.Model.extend({

            idAttribute: '_id',

            urlRoot: App.Credentials.base_api_url,

            initialize: function () {
                // ok
                this.url = this.urlRoot + this.id;
            }

        }),

        EmailCollection = Backbone.Collection.extend({

            model: Email,

            urlRoot: App.Credentials.base_api_url,

            initialze: function(){
                this.url = this.urlRoot + '';
            },

            remoteCountVal: 0,
            remoteCount: function(){
                var that = this;
                return Api.count({
                    data: {
                        model: 'Email',
                        conditions: {
                            'original.labels' : '\\\\Sent',
                            'common.date_sec' : {
                                '$gte' : moment().startOf('day').unix()
                            }
                        }
                    },
                    success: function(code, data, msg){
                        that.remoteCountVal = data + 25;
                        that.trigger('updateRemoteCount');
                    }

                });
            }


        });

    return {
        Email: Email,
        EmailCollection: EmailCollection
    };

});
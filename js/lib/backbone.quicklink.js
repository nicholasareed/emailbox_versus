//     (c) 2012 Raymond Julin, Keyteq AS
//     Backbone.touch may be freely distributed under the MIT license.
(function (factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone'], factory);
    } else {
        // Browser globals
        factory(_, Backbone);
    }
}(function (_, Backbone) {

    "use strict";

    var getValue = function(object, prop) {
        if (!(object && object[prop])) return null;
        return _.isFunction(object[prop]) ? object[prop]() : object[prop];
    };
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    _.extend(Backbone.View.prototype, {

    	quicklink: function(ev){
            ev.preventDefault();
            ev.stopPropagation();
    		var elem = ev.currentTarget;
    		Backbone.history.navigate($(elem).attr('href'), {trigger: true});
    	},

    });
    return Backbone;
}));
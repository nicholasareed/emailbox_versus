(function (factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['handlebars'], factory);
    } else {
        // Browser globals
        factory(Handlebars);
    }
}(function (Handlebars) {

    "use strict";

    Handlebars.registerHelper('print', function(data) {
        console.info(data);
        return "";
    });


    Handlebars.registerHelper('length', function(val, addition) {
        var tmp;
        try {
            tmp = val.length;
        } catch(err) {
            // invalid length attempt (probably undefined)
            tmp = 0;
        }

        if(addition != undefined){
            tmp += parseInt(addition, 10);
        }

        // Should never be below zero
        if(tmp < 0){
            tmp = 0;
        }

        return tmp;

    });

    Handlebars.registerHelper('size', function(val) {
        return _.size(val);
    });

    Handlebars.registerHelper('plusone', function(val) {
        return val + 1;
    });

    Handlebars.registerHelper('toFixed', function(val, len) {
        var tmp = parseFloat(val).toFixed(len);
        return isNaN(tmp) ? '--' : tmp;
    });

    Handlebars.registerHelper('toFixedOrNone', function(val, len) {
        var tmp = parseFloat(val).toFixed(len).toString();
        // console.log(tmp);
        // console.log(parseInt(tmp, 10).toString());
        if (parseInt(tmp, 10).toString() == tmp){
            return isNaN(tmp) ? '--' : parseInt(tmp, 10).toString();
        }
        return isNaN(tmp) ? '--' : tmp;
    });

    Handlebars.registerHelper('display_trip_list_date', function(carvoyant_datetime, short_or_long) {
        // return Today, Yesterday, or the actual date
        var date_string = '';
        var m;
        try {
            if(carvoyant_datetime.length == 20){
                m = moment(carvoyant_datetime, "YYYYMMDD HHmmss"); // 20131106T230554+0000
            } else {
                m = moment(carvoyant_datetime);
            }
        } catch(err){
            return "";
        }
        
        if(!m.isValid()){
            return "Unknown"
        }

        var now = moment();
        if(now.diff(m, 'days') == 0){
            return "Today";
        }
        if(now.diff(m, 'days') == 1){
            return "Yesterday";
        }

        if(short_or_long == "long"){
            return m.format("MMMM Do");
        } else {
            return m.format("MMM Do");
        }
    });


    Handlebars.registerHelper('display_trip_list_time', function(carvoyant_datetime) {
        // return "3:40pm" or similar
        var date_string = '';
        var m;
        try {
            if(carvoyant_datetime.length == 20){
                m = moment(carvoyant_datetime, "YYYYMMDD HHmmss"); // 20131106T230554+0000
            } else {
                m = moment(carvoyant_datetime);
            }
        } catch(err){
            return "";
        }
        
        if(!m.isValid()){
            return "Unknown"
        }
        var tmp_format = m.format("h:mma");
        // console.log(tmp_format);
        // console.log(tmp_format.substr(0,tmp_format.length - 1));
        return tmp_format.substr(0,tmp_format.length - 1); // like remove the "m" in "am" or "pm"
    });


    Handlebars.registerHelper('display_drive_time', function(obj) {
        // return "3:40pm" or similar
        var time_string = '';
        var start_time = moment(obj.start_time, "YYYYMMDD HHmmss"), // 20131106T230554+0000
            end_time = moment(obj.end_time, "YYYYMMDD HHmmss"); // 20131106T230554+0000
        

        var diff = (end_time - start_time) / 1000;

        // console.log('diff: ', diff);

        var hour_diff   = Math.floor(diff / (60 * 60)),
            min_diff    = Math.ceil(diff / (60));


        min_diff = min_diff - (hour_diff * 60)

        if(hour_diff > 0){
            time_string += hour_diff + 'h ';
        }

        time_string += min_diff + 'm';
        
        return time_string;
    });


    Handlebars.registerHelper('seconds_to_drive_time', function(diff) {
        // return "3:40pm" or similar
        var time_string = '';

        // console.log('diff: ', diff);

        var hour_diff   = Math.floor(diff / (60 * 60)),
            min_diff    = Math.ceil(diff / (60));


        if(hour_diff > 0){
            time_string += hour_diff + 'h ';
        }

        time_string += min_diff + 'm';
        
        return time_string;
    });


    Handlebars.registerHelper('display_fromNow', function(carvoyant_datetime) {
        // return "3:40pm" or similar
        var m;

        try {
            if(carvoyant_datetime.length == 20){
                m = moment(carvoyant_datetime, "YYYYMMDD HHmmss").max(new Date()); // 20131106T230554+0000
            } else {
                m = moment(carvoyant_datetime).max(new Date());
            }
        } catch(err){
            return "";
        }
        
        if(!m.isValid()){
            return ""
        }

        return m.fromNow();
    });


    Handlebars.registerHelper('display_fromNow_lastRunning', function(car) {
        // return "3:40pm" or similar
        var m;
        try {
            m = moment(car.latest_data.lastRunningTimestamp, "YYYYMMDD HHmmss").max(new Date()); // 20131106T230554+0000
        } catch(err){
            return "";
        }
        
        if(!m.isValid()){
            return ""
        }

        return m.fromNow();
    });


    Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
        // Able to do things like:
        /*

        {{#compare Database.Tables.Count ">" 5}}
            There are more than 5 tables
        {{/compare}}

        {{#compare "Test" "Test"}}
            Default comparison of "==="
        {{/compare}}

        */

        var operators, result;
        
        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }
        
        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }
        
        operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '!==': function (l, r) { return l !== r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        };
        
        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }
        
        result = operators[operator](lvalue, rvalue);
        
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    });



    Handlebars.registerHelper('compare_length', function (lvalue, operator, rvalue, options) {
        // Able to do things like:
        /*

        {{#compare Database.Tables.Count ">" 5}}
            There are more than 5 tables
        {{/compare}}

        {{#compare "Test" "Test"}}
            Default comparison of "==="
        {{/compare}}

        */

        var operators, result;

        if(lvalue == "undefined" || lvalue == null){
            return options.inverse(this);
        }
        
        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }
        
        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }
        
        operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '!==': function (l, r) { return l !== r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        };
        
        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }
        
        result = operators[operator](lvalue.length, rvalue);
        
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    });



    Handlebars.registerHelper('compare_size', function (lvalue, operator, rvalue, options) {
        // Able to do things like:
        /*

        {{#compare Database.Tables.Count ">" 5}}
            There are more than 5 tables
        {{/compare}}

        {{#compare "Test" "Test"}}
            Default comparison of "==="
        {{/compare}}

        */

        var operators, result;
        
        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }
        
        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }
        
        operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '!==': function (l, r) { return l !== r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        };
        
        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }
        
        result = operators[operator](_.size(lvalue), rvalue);
        
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    });


    Handlebars.registerHelper('getGoogleMapsStaticUrlForTripLeg', function (tripLeg, index, width) {
        // Putting a label for each leg of the trip
        // - only the beginning of the trip has the "start"
        // - unless the GPS has moved a ton? (we could do haversine)

        var markers = [],
            paths = [];
            
        // console.log(tripLegs[index]); // trip object
        var start_gps = JSON.parse(tripLeg.start_gps),
            end_gps = JSON.parse(tripLeg.end_gps),
            label = '';

        // Markers
        // - S (start) and E (end)
        markers.push('markers=' + 'color:green%7Clabel:S%7C' + start_gps.latitude + ',' + start_gps.longitude);
        markers.push('markers=' + 'color:red%7Clabel:E%7C' + end_gps.latitude + ',' + end_gps.longitude);

        // Add the path
        paths.push('path=color:blue%7Cweight:1%7C' + start_gps.latitude + ',' + start_gps.longitude + '%7C' + end_gps.latitude + ',' + end_gps.longitude);


        // Get widths and build the map url
        try {
            width = width || $('body').width();
            if(width > 400){width = 400;}
        } catch(err){
            width = 300;
        }

        var maps_url = "http://maps.googleapis.com/maps/api/staticmap?size="+width+"x" + width + "&maptype=roadmap&sensor=false&visual_refresh=true&" + markers.join('&') + '&' + paths.join('&');

        // console.log('Map URL');
        // console.log(maps_url);

        return maps_url;
    });
    

    Handlebars.registerHelper('times', function(n, block) {
        var accum = '';
        for(var i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum;
    });

    return Handlebars;
}));
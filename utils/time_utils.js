
// Author - Rajesh Borade

var moment = require('moment');

function TimeUtils(timestamp1, timestamp2) {

    this.moment1 = moment(new Date(timestamp1));
    this.moment2 = moment(new Date(timestamp2));

    this.getHourDifference = function() {
        var diff = moment(this.moment2).diff(this.moment1, 'hours');
        if(diff < 0) {
            return (diff * -1);
        }
        return diff;
    }

    this.getDaysDifference = function() {
        var diff = moment(this.moment2).diff(this.moment1, 'days');
        if(diff < 0) {
            return (diff * -1);
        }
        return diff;
    }
}

module.exports = TimeUtils;

/* TEST USAGE

var TimeUtils = require('./time_utils');

var ts1 = '2018-02-04T06:06:46.889Z';
var ts2 = '2018-02-03T06:06:46.889Z';

var timeUtils = new TimeUtils(ts1, ts2);

console.log(timeUtils.getDaysDifference());
console.log(timeUtils.getHourDifference());


*/
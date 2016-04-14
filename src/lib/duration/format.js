import { createDuration } from './create';
import isFunction from '../utils/is-function';
import isObject from '../utils/is-object';
import isArray from '../utils/is-array';
import extend from '../utils/extend';
import each from '../utils/each';
import map from '../utils/map';
import find from '../utils/find';
import findLast from '../utils/find-last';
import compact from '../utils/compact';
import pluck from '../utils/pluck';
import unique from '../utils/unique';
import intersection from '../utils/intersection';

function __configure (settings, config) {
    config.forEach(function(setting) {
        if (typeof setting === 'string' || isFunction(setting)) {
            settings.template = setting;
            return;
        }
        if (typeof setting === 'number') {
            settings.precision = setting;
            return;
        }
        if (isObject(setting)) {
            extend(settings, setting);
            return;
        }
    });
}

function __format () {
    var tokenizer, tokens, types, typeMap, momentTypes, foundFirst, trimIndex,
        args = Array.prototype.slice.call(arguments),
        __copy = createDuration(this);

    var settings = extend({}, this.format.defaults);
    __configure(settings, args);
    settings.duration = this;

    types = settings.types = (isArray(settings.types) ? settings.types : settings.types.split(' '));

    if (isFunction(settings.template)) {
        settings.template = settings.template.apply(settings);
    }

    tokenizer = new RegExp(map(types, function (type) {
        return settings[type].source;
    }).join('|'), 'g');

    typeMap = function (token) {
        return find(types, function (type) {
            return settings[type].test(token);
        });
    };

    tokens = map(settings.template.match(tokenizer), function (token, index) {
        var type = typeMap(token), length = token.length;
        return {
            index: index,
            length: length,
            // replace escaped tokens with the non-escaped token text
            token: (type === 'escape' ? token.replace(settings.escape, '$1') : token),
            // ignore type on non-moment tokens
            type: ((type === 'escape' || type === 'general') ? null : type)
        };
    }, this);

    // unique moment token types in the template (in order of descending magnitude)
    momentTypes = intersection(types, unique(compact(pluck(tokens, 'type'))));

    // exit early if there are no momentTypes
    if (!momentTypes.length) {
        return pluck(tokens, 'token').join('');
    }

    // TODO: start here

}

__format.defaults = {

    // token definitions
    escape: /\[(.+?)\]/,
    years: /[Yy]+/,
    months: /M+/,
    weeks: /[Ww]+/,
    days: /[Dd]+/,
    hours: /[Hh]+/,
    minutes: /m+/,
    seconds: /s+/,
    milliseconds: /S+/,
    general: /.+?/,

    // token type names
    // in order of descending magnitude
    // can be a space-separated token name list or an array of token names
    types: 'escape years months weeks days hours minutes seconds milliseconds general',

    // format options
    // trim
    // 'left' - template tokens are trimmed from the left until the first moment token that has a value >= 1
    // 'right' - template tokens are trimmed from the right until the first moment token that has a value >= 1
    // (the final moment token is not trimmed, regardless of value)
    // `false` - template tokens are not trimmed
    trim: 'left',

    // precision
    // number of decimal digits to include after (to the right of) the decimal point (positive integer)
    // or the number of digits to truncate to 0 before (to the left of) the decimal point (negative integer)
    precision: 0,

    // force first moment token with a value to render at full length even when template is trimmed and first moment token has length of 1
    forceLength: null,

    // template used to format duration
    // may be a function or a string
    // template functions are executed with the `this` binding of the settings object
    // so that template strings may be dynamically generated based on the duration object
    // (accessible via `this.duration`)
    // or any of the other settings
    template: function () {
        var types = this.types,
            dur = this.duration,
            lastType = findLast(types, function (type) {
                return dur._data[type];
            });

        // default template strings for each duration dimension type
        switch (lastType) {
            case 'seconds':
                return 'h:mm:ss';
            case 'minutes':
                return 'd[d] h:mm';
            case 'hours':
                return 'd[d] h[h]';
            case 'days':
                return 'M[m] d[d]';
            case 'weeks':
                return 'y[y] w[w]';
            case 'months':
                return 'y[y] M[m]';
            case 'years':
                return 'y[y]';
            default:
                return 'y[y] M[m] d[d] h:mm:ss';
        }
    }
};

export { __format as format };

// moment.duration.fn.format = function () {



//

//         // calculate values for each token type in the template
//         each(momentTypes, function (momentType, index) {
//             var value, wholeValue, decimalValue, isLeast, isMost;

//             // calculate integer and decimal value portions
//             value = remainder.as(momentType);
//             wholeValue = (value > 0 ? Math.floor(value) : Math.ceil(value));
//             decimalValue = value - wholeValue;

//             // is this the least-significant moment token found?
//             isLeast = ((index + 1) === momentTypes.length);

//             // is this the most-significant moment token found?
//             isMost = (!index);

//             // update tokens array
//             // using this algorithm to not assume anything about
//             // the order or frequency of any tokens
//             each(tokens, function (token) {
//                 if (token.type === momentType) {
//                     extend(token, {
//                         value: value,
//                         wholeValue: wholeValue,
//                         decimalValue: decimalValue,
//                         isLeast: isLeast,
//                         isMost: isMost
//                     });

//                     if (isMost) {
//                         // note the length of the most-significant moment token:
//                         // if it is greater than one and forceLength is not set, default forceLength to `true`
//                         if (settings.forceLength == null && token.length > 1) {
//                             settings.forceLength = true;
//                         }

//                         // rationale is this:
//                         // if the template is "h:mm:ss" and the moment value is 5 minutes, the user-friendly output is "5:00", not "05:00"
//                         // shouldn't pad the `minutes` token even though it has length of two
//                         // if the template is "hh:mm:ss", the user clearly wanted everything padded so we should output "05:00"
//                         // if the user wanted the full padded output, they can set `{ trim: false }` to get "00:05:00"
//                     }
//                 }
//             });

//             // update remainder
//             remainder.subtract(wholeValue, momentType);
//         });

//         // trim tokens array
//         if (settings.trim) {
//             tokens = (settings.trim === "left" ? rest : initial)(tokens, function (token) {
//                 // return `true` if:
//                 // the token is not the least moment token (don't trim the least moment token)
//                 // the token is a moment token that does not have a value (don't trim moment tokens that have a whole value)
//                 return !(token.isLeast || (token.type != null && token.wholeValue));
//             });
//         }


//         // build output

//         // the first moment token can have special handling
//         foundFirst = false;

//         // run the map in reverse order if trimming from the right
//         if (settings.trim === "right") {
//             tokens.reverse();
//         }

//         tokens = map(tokens, function (token) {
//             var val,
//                 decVal;

//             if (!token.type) {
//                 // if it is not a moment token, use the token as its own value
//                 return token.token;
//             }

//             // apply negative precision formatting to the least-significant moment token
//             if (token.isLeast && (settings.precision < 0)) {
//                 val = (Math.floor(token.wholeValue * Math.pow(10, settings.precision)) * Math.pow(10, -settings.precision)).toString();
//             } else {
//                 val = token.wholeValue.toString();
//             }

//             // remove negative sign from the beginning
//             val = val.replace(/^\-/, "");

//             // apply token length formatting
//             // special handling for the first moment token that is not the most significant in a trimmed template
//             if (token.length > 1 && (foundFirst || token.isMost || settings.forceLength)) {
//                 val = padZero(val, token.length);
//             }

//             // add decimal value if precision > 0
//             if (token.isLeast && (settings.precision > 0)) {
//                 decVal = token.decimalValue.toString().replace(/^\-/, "").split(/\.|e\-/);
//                 switch (decVal.length) {
//                     case 1:
//                         val += "." + padZero(decVal[0], settings.precision, true).slice(0, settings.precision);
//                         break;

//                     case 2:
//                         val += "." + padZero(decVal[1], settings.precision, true).slice(0, settings.precision);
//                         break;

//                     case 3:
//                         val += "." + padZero(repeatZero((+decVal[2]) - 1) + (decVal[0] || "0") + decVal[1], settings.precision, true).slice(0, settings.precision);
//                         break;

//                     default:
//                         throw "Moment Duration Format: unable to parse token decimal value.";
//                 }
//             }

//             // add a negative sign if the value is negative and token is most significant
//             if (token.isMost && token.value < 0) {
//                 val = "-" + val;
//             }

//             foundFirst = true;

//             return val;
//         });

//         // undo the reverse if trimming from the right
//         if (settings.trim === "right") {
//             tokens.reverse();
//         }

//         return tokens.join("");
//     };

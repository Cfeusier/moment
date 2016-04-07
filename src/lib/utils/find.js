import isFunction from './is-function';

export default function find(arr, fn) {
    var index = 0,
        max = arr.length,
        match;
    if (isFunction(fn)) {
        match = fn;
        fn = function (item) {
            return item === match;
        };
    }
    while (index < max) {
        if (fn(arr[index])) {
            return arr[index];
        }
        ++index;
    }
}

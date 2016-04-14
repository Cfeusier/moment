import each from './each';

export default function rest(arr, fn) {
    var results = [];

    each(arr, function (item, index) {
        if (!fn(item)) {
            results = arr.slice(index);
            return false;
        }
    });

    return results;
}

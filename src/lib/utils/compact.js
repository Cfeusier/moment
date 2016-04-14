import each from './each';

export default function compact(arr) {
    var results = [];

    each(arr, function (item) {
        if (item) {
            results.push(item);
        }
    });

    return results;
}

import each from './each';
import find from './find';

export default function unique(arr) {
    var results = [];

    each(arr, function (_a) {
        if (!find(results, _a)) {
            results.push(_a);
        }
    });

    return results;
}

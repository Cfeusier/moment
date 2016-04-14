import each from './each';
import unique from './unique';

export default function intersection(a, b) {
    var results = [];

    each(a, function (_a) {
        each(b, function (_b) {
            if (_a === _b) {
                results.push(_a);
            }
        });
    });

    return unique(results);
}

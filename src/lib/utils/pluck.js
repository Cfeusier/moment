import map from './map';

export default function pluck(arr, prop) {
    return map(arr, function (item) {
        return item[prop];
    });
}

export default function each(arr, fn) {
    var index = 0, max = arr.length;

    if (!arr || !max) { return; }

    while (index < max) {
        if (fn(arr[index], index) === false) { return; }
        ++index;
    }
}

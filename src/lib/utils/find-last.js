export default function findLast(arr, fn) {
    var index = arr.length;
    while (index--) {
        if (fn(arr[index])) {
            return arr[index];
        }
    }
}

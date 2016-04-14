import rest from './rest';

export default function initial(arr, fn) {
    var reversed = arr.slice().reverse();

    return rest(reversed, fn).reverse();
}

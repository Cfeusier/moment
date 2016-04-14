export default function repeat(character, qty) {
    var result = '';

    // exit early if qty is 0, a negative number, or doesn't coerce to an integer
    qty = parseInt(qty, 10);
    if (!qty || qty < 1) {
        return result;
    }

    while (qty) {
        result += character;
        qty -= 1;
    }

    return result;
}

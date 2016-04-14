// pads a string with character up to a specified length
// will not pad a string if its length is aready
// greater than or equal to the specified length
// default output pads with characters on the left
// set isRight to `true` to pad with characters on the right
export default function pad(character, str, len, isRight) {
    if (str == null) {
        str = '';
    }
    str = '' + str;

    return (isRight ? str : '') + repeat(character, len - str.length) + (isRight ? '' : str);
}

import repeat from './repeat';

export default function pad(character, str, len, isRight) {
    if (str == null) {
        str = '';
    }
    str = '' + str;

    return (isRight ? str : '') + repeat(character, len - str.length) + (isRight ? '' : str);
}

import { module, test } from '../qunit';
import moment from '../../moment';

module('duration format');

test('existence of function', function() {
    var m1 = moment('2012-01-15T00:00:00.000Z'),
        m2 = moment('2012-02-17T00:00:00.000Z'),
        d = moment.duration({from: m1, to: m2});
    d.format();
    assert.equal(typeof d.format === 'function', true);
});

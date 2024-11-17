import { HSBK_MINIMUM_RAW, HSBK_MAXIMUM_RAW } from '../color/colorHSBK';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 6;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    const brightness = buf.readUInt16LE(offset);
    offset += 2;
    const fadeTime = buf.readUInt32LE(offset);
    offset += 4;
    const obj = {
        brightness,
        fadeTime
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.brightness !== HSBK_MINIMUM_RAW && obj.brightness !== HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be ' + HSBK_MINIMUM_RAW + ' or ' + HSBK_MAXIMUM_RAW + ' only')
            .build();
    }
    buf.writeUInt16LE(obj.brightness, offset);
    offset += 2;
    /** Duration is 0 by default */
    if (obj.fadeTime) {
        buf.writeUInt32LE(obj.fadeTime, offset);
    }
    offset += 4;
    return buf;
}
export const setDimRelative = {
    type: 105,
    name: 'setDimRelative',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=setDimRelative.js.map
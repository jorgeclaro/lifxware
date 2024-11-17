import { HSBK_MAXIMUM_RAW, HSBK_MINIMUM_RAW } from '../color/colorHSBK';
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
    const fadetime = buf.readUInt32LE(offset);
    offset += 4;
    const obj = {
        brightness,
        fadeTime: fadetime
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.brightness !== HSBK_MINIMUM_RAW && obj.brightness !== HSBK_MINIMUM_RAW) {
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
export const setDimAbsolute = {
    type: 104,
    name: 'setDimAbsolute',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=setDimAbsolute.js.map
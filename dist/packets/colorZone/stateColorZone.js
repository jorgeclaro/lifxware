import { HSBK_MINIMUM_RAW, HSBK_MAXIMUM_RAW, HSBK_MINIMUM_KELVIN, HSBK_MAXIMUM_KELVIN } from '../color/colorHSBK';
import { HSBK_DEFAULT_KELVIN } from '../color/colorHSBK';
import { ZONE_INDEX_MINIMUM_VALUE, ZONE_INDEX_MAXIMUM_VALUE } from './colorZone';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 10;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    const count = buf.readUInt8(offset);
    offset += 1;
    const index = buf.readUInt8(offset);
    offset += 1;
    const hue = buf.readUInt16LE(offset);
    offset += 2;
    const saturation = buf.readUInt16LE(offset);
    offset += 2;
    const brightness = buf.readUInt16LE(offset);
    offset += 2;
    const kelvin = buf.readUInt16LE(offset);
    offset += 2;
    const color = {
        hue,
        saturation,
        brightness,
        kelvin
    };
    const obj = {
        count,
        index,
        color
    };
    return obj;
}
/**
 * Converts the given packet specific object into a packet
 * @param obj object with configuration data
 * @return packet
 */
//eslint-disable-next-line complexity
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.count < ZONE_INDEX_MINIMUM_VALUE || obj.count > ZONE_INDEX_MAXIMUM_VALUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid count value given for stateColorZone LIFX packet, must be a number between ' +
            ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.count, offset);
    offset += 1;
    if (obj.index < ZONE_INDEX_MINIMUM_VALUE || obj.index > ZONE_INDEX_MAXIMUM_VALUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid index value given for stateColorZone LIFX packet, must be a number between ' +
            ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.index, offset);
    offset += 1;
    if (obj.color.hue < HSBK_MINIMUM_RAW || obj.color.hue > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects hue to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
    buf.writeUInt16LE(obj.color.hue, offset);
    offset += 2;
    if (obj.color.saturation < HSBK_MINIMUM_RAW || obj.color.saturation > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects saturation to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
    buf.writeUInt16LE(obj.color.saturation, offset);
    offset += 2;
    if (obj.color.brightness < HSBK_MINIMUM_RAW || obj.color.brightness > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
    buf.writeUInt16LE(obj.color.brightness, offset);
    offset += 2;
    if (!obj.color.kelvin) {
        obj.color.kelvin = HSBK_DEFAULT_KELVIN;
    }
    if (obj.color.kelvin < HSBK_MINIMUM_KELVIN || obj.color.kelvin > HSBK_MAXIMUM_KELVIN) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects kelvin to be a number between ' + HSBK_MINIMUM_KELVIN + ' and ' + HSBK_MAXIMUM_KELVIN)
            .build();
    }
    buf.writeUInt16LE(obj.color.kelvin, offset);
    offset += 2;
    return buf;
}
export const stateZone = {
    type: 503,
    name: 'stateColorZone',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateColorZone.js.map
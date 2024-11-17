import { HSBK_MAXIMUM_RAW, HSBK_MINIMUM_RAW, HSBK_MINIMUM_KELVIN, HSBK_MAXIMUM_KELVIN } from '../color/colorHSBK';
import { HSBK_DEFAULT_KELVIN } from '../color/colorHSBK';
import { ZONE_INDEX_MINIMUM_VALUE, ZONE_INDEX_MAXIMUM_VALUE } from './colorZone';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 10;
function toObject(buf) {
    let offset = 0;
    if (buf.length < SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE)
            .withContextualMessage('Invalid length for LIFX packet, expected minimum 10 but received ' + buf.length)
            .build();
    }
    const count = buf.readUInt8(offset);
    offset += 1;
    const index = buf.readUInt8(offset);
    offset += 1;
    const colors = [];
    while (buf.length - offset >= 8) {
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
        colors.push(color);
    }
    const obj = {
        count,
        index,
        color: colors
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.count < ZONE_INDEX_MINIMUM_VALUE || obj.count > ZONE_INDEX_MAXIMUM_VALUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid count value given for stateColorMultiZone LIFX packet, must be a number between ' +
            ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.count, offset);
    offset += 1;
    if (obj.index < ZONE_INDEX_MINIMUM_VALUE || obj.index > ZONE_INDEX_MAXIMUM_VALUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid index value given for stateColorMultiZone LIFX packet, must be a number between ' +
            ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.index, offset);
    offset += 1;
    if (obj.color.length < 1 || obj.color.length > 8) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid set of color values given for stateColorMultiZone LIFX packet, must be an array of 1 to 8 objects')
            .build();
    }
    //eslint-disable-next-line complexity
    obj.color.forEach(function (colorObj, index) {
        if (colorObj.hue < HSBK_MINIMUM_RAW || colorObj.hue > HSBK_MAXIMUM_RAW) {
            throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
                .withContextualMessage('Invalid color hue given at index ' +
                index +
                ', must be a number between ' +
                HSBK_MINIMUM_RAW +
                ' and ' +
                HSBK_MAXIMUM_RAW)
                .build();
        }
        buf.writeUInt16LE(colorObj.hue, offset);
        offset += 2;
        if (colorObj.saturation < HSBK_MINIMUM_RAW || colorObj.saturation > HSBK_MAXIMUM_RAW) {
            throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
                .withContextualMessage('Invalid color saturation given at index ' +
                index +
                ', must be a number between ' +
                HSBK_MINIMUM_RAW +
                ' and ' +
                HSBK_MAXIMUM_RAW)
                .build();
        }
        buf.writeUInt16LE(colorObj.saturation, offset);
        offset += 2;
        if (colorObj.brightness < HSBK_MINIMUM_RAW || colorObj.brightness > HSBK_MAXIMUM_RAW) {
            throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
                .withContextualMessage('Invalid color brightness given at index ' +
                index +
                ', must be a number between ' +
                HSBK_MINIMUM_RAW +
                ' and ' +
                HSBK_MAXIMUM_RAW)
                .build();
        }
        buf.writeUInt16LE(colorObj.brightness, offset);
        offset += 2;
        if (!colorObj.kelvin) {
            colorObj.kelvin = HSBK_DEFAULT_KELVIN;
        }
        if (colorObj.kelvin < HSBK_MINIMUM_KELVIN || colorObj.kelvin > HSBK_MAXIMUM_KELVIN) {
            throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
                .withContextualMessage('Invalid color kelvin given at index ' +
                index +
                ', must be a number between ' +
                HSBK_MINIMUM_RAW +
                ' and ' +
                HSBK_MAXIMUM_RAW)
                .build();
        }
        buf.writeUInt16LE(colorObj.kelvin, offset);
        offset += 2;
    });
    return buf;
}
export const stateMultiZone = {
    type: 506,
    name: 'stateColorMultiZone',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateColorMultiZone.js.map
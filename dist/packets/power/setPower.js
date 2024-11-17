import { POWER_MAXIMUM_RAW, POWER_MINIMUM_RAW } from './power';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 6;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    const power = buf.readUInt16LE(offset);
    offset += 2;
    const duration = buf.readUInt32LE(offset);
    offset += 4;
    const obj = {
        power,
        duration
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.power !== POWER_MINIMUM_RAW && obj.power !== POWER_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage(`Invalid level given for setPower LIFX packet, only ${POWER_MINIMUM_RAW} and ${POWER_MAXIMUM_RAW} are supported`)
            .build();
    }
    buf.writeUInt16LE(obj.power, offset);
    offset += 2;
    /** Duration is 0 by default */
    if (obj.duration) {
        buf.writeUInt32LE(obj.duration, offset);
    }
    offset += 4;
    return buf;
}
export const setPower = {
    type: 117,
    name: 'setPower',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=setPower.js.map
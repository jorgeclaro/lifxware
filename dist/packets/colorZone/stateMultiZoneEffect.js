import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
import * as utils from '../../lib/utils';
const SIZE = 59;
function toObject(buf) {
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    let offset = 0;
    const instanceid = buf.readUInt32LE(offset);
    offset += 4;
    const type = buf.readUInt8(offset);
    offset += 1;
    offset += 2;
    const speed = buf.readUInt32LE(offset);
    offset += 4;
    const duration = utils.readUInt64LE(buf, offset);
    offset += 8;
    offset += 4;
    offset += 4;
    const parameter = [];
    for (let i = 0; i < 8; i++) {
        parameter.push(buf.readUInt32LE(offset));
        offset += 4;
    }
    return {
        instanceid,
        type,
        speed,
        duration,
        parameter
    };
}
export const stateMultiZoneEffect = {
    type: 509,
    name: 'stateMultiZoneEffect',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject
};
//# sourceMappingURL=stateMultiZoneEffect.js.map
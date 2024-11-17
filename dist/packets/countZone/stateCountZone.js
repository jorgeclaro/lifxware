import * as utils from '../../lib/utils';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 9;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    const time = utils.readUInt64LE(buf, offset);
    offset += 8;
    const count = buf.readUInt8(offset);
    offset += 1;
    const obj = {
        time,
        count
    };
    return obj;
}
export const stateCountZone = {
    type: 505,
    name: 'stateCountZone',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject
};
//# sourceMappingURL=stateCountZone.js.map
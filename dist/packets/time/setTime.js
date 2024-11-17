import * as utils from '../../lib/utils';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 8;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    const time = utils.readUInt64LE(buf, offset);
    offset += 2;
    const obj = {
        time
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    utils.writeUInt64LE(buf, offset, obj.time);
    offset += 2;
    return buf;
}
export const setTime = {
    type: 5,
    name: 'setTime',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=setTime.js.map
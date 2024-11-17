import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 11;
//eslint-disable-next-line complexity
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.writeUInt8(obj.tile_index, offset);
    offset += 1;
    /** reserved */
    offset += 2;
    buf.writeFloatLE(obj.user_x, offset);
    offset += 4;
    buf.writeFloatLE(obj.user_y, offset);
    offset += 4;
    return buf;
}
//eslint-disable-next-line complexity
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    let obj;
    obj.tile_index = buf.readUInt8(offset);
    offset += 1;
    /** reserved */
    offset += 2;
    obj.user_x = buf.readFloatLE(offset);
    offset += 4;
    obj.user_y = buf.readFloatLE(offset);
    offset += 4;
    return obj;
}
export const setUserPosition = {
    type: 703,
    name: 'setUserPosition',
    legacy: false,
    size: SIZE,
    tagged: false,
    toBuffer,
    toObject
};
//# sourceMappingURL=setUserPosition.js.map
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 6;
//eslint-disable-next-line complexity
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.writeUInt8(obj.tile_index, offset);
    offset += 1;
    buf.writeUInt8(obj.length, offset);
    offset += 1;
    /** reserved */
    offset += 1;
    buf.writeUInt8(obj.x, offset);
    offset += 1;
    buf.writeUInt8(obj.y, offset);
    offset += 1;
    buf.writeUInt8(obj.width, offset);
    offset += 1;
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
    obj.length = buf.readUInt8(offset);
    offset += 1;
    /** reserved */
    offset += 1;
    obj.x = buf.readUInt8(offset);
    offset += 1;
    obj.y = buf.readUInt8(offset);
    offset += 1;
    obj.width = buf.readUInt8(offset);
    offset += 1;
    return obj;
}
export const getTileState64 = {
    type: 707,
    name: 'getTileState64',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=getTileState64.js.map
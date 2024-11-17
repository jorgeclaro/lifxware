import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 522;
const MAX_HSBK = 64;
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
    buf.writeUInt32LE(obj.duration, offset);
    offset += 4;
    for (const color of obj.colors) {
        buf.writeUInt16LE(color.hue, offset);
        offset += 2;
        buf.writeUInt16LE(color.saturation, offset);
        offset += 2;
        buf.writeUInt16LE(color.brightness, offset);
        offset += 2;
        buf.writeUInt16LE(color.kelvin, offset);
        offset += 2;
    }
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
    obj.duration = buf.readUInt32LE(offset);
    offset += 4;
    for (let i = 0; i < MAX_HSBK; i++) {
        let color;
        color.hue = buf.readUInt16LE(offset);
        offset += 2;
        color.saturation = buf.readUInt16LE(offset);
        offset += 2;
        color.brightness = buf.readUInt16LE(offset);
        offset += 2;
        color.kelvin = buf.readUInt16LE(offset);
        offset += 2;
        obj.colors.push(color);
    }
    return obj;
}
export const stateTileState64 = {
    type: 711,
    name: 'stateTileState64',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateTileState64.js.map
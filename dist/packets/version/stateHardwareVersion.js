import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 12;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    const vendorId = buf.readUInt32LE(offset);
    offset += 4;
    const productId = buf.readUInt32LE(offset);
    offset += 4;
    const version = buf.readUInt32LE(offset);
    offset += 4;
    const obj = {
        vendorId,
        productId,
        version
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.writeUInt32LE(obj.vendorId, offset);
    offset += 4;
    buf.writeUInt32LE(obj.productId, offset);
    offset += 4;
    buf.writeUInt32LE(obj.version, offset);
    offset += 4;
    return buf;
}
export const stateVersion = {
    type: 33,
    name: 'stateVersion',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateHardwareVersion.js.map
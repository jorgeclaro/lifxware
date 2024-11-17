import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 5;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    const service = buf.readUInt8(offset);
    offset += 1;
    const port = buf.readUInt32LE(offset);
    offset += 4;
    const obj = {
        service,
        port
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.writeUInt8(obj.service, offset);
    offset += 1;
    buf.writeUInt32LE(obj.port, offset);
    offset += 4;
    return buf;
}
export const stateService = {
    type: 3,
    name: 'stateService',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateService.js.map
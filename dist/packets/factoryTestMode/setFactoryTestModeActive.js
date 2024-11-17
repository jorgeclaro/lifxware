import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 1;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    const enabled = Boolean(buf.readUInt8(offset));
    offset += 2;
    const obj = {
        enabled
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.writeUInt8(obj.enabled ? 1 : 0, offset);
    offset += 2;
    return buf;
}
export const setFactoryTestModeActive = {
    type: 39,
    name: 'getFactoryTestModeActive',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=setFactoryTestModeActive.js.map
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 32;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    let label = buf.toString('utf8', offset, offset + 32);
    label = label.replace(/\0/g, '');
    offset += 32;
    const obj = {
        label
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.write(obj.label, offset, 32, 'utf8');
    offset += 32;
    return buf;
}
export const setLabel = {
    type: 24,
    name: 'setLabel',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=setLabel.js.map
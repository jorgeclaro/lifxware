import * as utils from '../../lib/utils';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 56;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    const group = buf.toString('hex', offset, offset + 16);
    offset += 16;
    let label = buf.toString('utf8', offset, offset + 32);
    label = label.replace(/\0/g, '');
    offset += 32;
    const updatedAt = new Date(utils.readUInt64LE(buf, offset));
    offset += 8;
    const obj = {
        group,
        label,
        updatedAt
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.write(obj.group, offset, 16, 'hex');
    offset += 16;
    buf.write(obj.label, offset, 32, 'utf8');
    offset += 32;
    utils.writeUInt64LE(buf, offset, obj.updatedAt);
    offset += 8;
    return buf;
}
export const stateGroup = {
    type: 53,
    name: 'stateGroup',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateGroup.js.map
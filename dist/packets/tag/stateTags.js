import * as utils from '../../lib/utils';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 8;
function toObject(buf) {
    const obj = {};
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    let label = utils.readUInt64LE(buf, offset).toString();
    label = label.replace(/\0[\s\S]*$/g, '');
    offset += 2;
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    utils.writeUInt64LE(buf, offset, obj.tags);
    offset += 2;
    return buf;
}
export const stateTags = {
    type: 28,
    name: 'stateTags',
    legacy: true,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateTags.js.map
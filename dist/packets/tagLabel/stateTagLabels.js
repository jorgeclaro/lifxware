import * as utils from '../../lib/utils';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 40;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    let tagLabels = utils.readUInt64LE(buf, offset).toString();
    tagLabels = tagLabels.replace(/\0[\s\S]*$/g, '');
    offset += 2;
    const obj = {
        tagLabels
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    utils.writeUInt64LE(buf, offset, obj.tagLabels);
    offset += 2;
    return buf;
}
export const stateTagLabels = {
    type: 31,
    name: 'stageTagLabels',
    legacy: true,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateTagLabels.js.map
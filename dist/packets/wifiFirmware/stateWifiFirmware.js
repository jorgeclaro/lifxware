import * as utils from '../../lib/utils';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 20;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    const build = utils.readUInt64LE(buf, offset);
    offset += 8;
    const install = utils.readUInt64LE(buf, offset);
    offset += 8;
    const version = buf.readUInt32LE(offset);
    const majorVersion = (version >> 16) & 0xff;
    const minorVersion = version & 0xff;
    offset += 4;
    const obj = {
        build,
        install,
        version,
        majorVersion,
        minorVersion
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    utils.writeUInt64LE(buf, offset, obj.build);
    offset += 8;
    utils.writeUInt64LE(buf, offset, obj.install);
    offset += 8;
    buf.writeUInt32LE(obj.version, offset);
    offset += 4;
    return buf;
}
export const stateWifiFirmware = {
    type: 19,
    name: 'stateWifiFirmware',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateWifiFirmware.js.map
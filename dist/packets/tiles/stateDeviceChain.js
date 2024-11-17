import * as utils from '../../lib/utils';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
import { ER_TILE_INVALID_SIZE } from '../../errors/tileErrors';
const SIZE = 882;
const MAX_TILES = 16;
//eslint-disable-next-line complexity
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    let obj;
    obj.start_index = buf.readUInt8(offset);
    offset += 1;
    for (let i = 0; i < MAX_TILES - 1; i++) {
        let tile;
        tile.accel_meas_x = buf.readInt16LE(offset);
        offset += 2;
        tile.accel_meas_y = buf.readInt16LE(offset);
        offset += 2;
        tile.accel_meas_z = buf.readInt16LE(offset);
        offset += 2;
        /** reserved */
        offset += 2;
        tile.user_x = buf.readFloatLE(offset);
        offset += 4;
        tile.user_y = buf.readFloatLE(offset);
        offset += 4;
        tile.width = buf.readUInt8(offset);
        offset += 1;
        tile.height = buf.readUInt8(offset);
        offset += 1;
        /** reserved */
        offset += 1;
        tile.device_version_vendor = buf.readUInt32LE(offset);
        offset += 4;
        tile.device_version_product = buf.readUInt32LE(offset);
        offset += 4;
        tile.device_version_version = buf.readUInt32LE(offset);
        offset += 4;
        tile.firmware_build = utils.readUInt64LE(buf, offset);
        offset += 8;
        /** reserved */
        offset += 8;
        tile.firmware_version_minor = buf.readUInt16LE(offset);
        offset += 2;
        tile.firmware_version_major = buf.readUInt16LE(offset);
        offset += 2;
        /** reserved */
        offset += 4;
        obj.tile_devices.push(tile);
    }
    obj.total_count = buf.readUInt8(offset);
    offset += 1;
    return obj;
}
//eslint-disable-next-line complexity
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.writeUInt8(obj.start_index, offset);
    offset += 1;
    if (obj.tile_devices.length !== MAX_TILES) {
        throw new ServiceErrorBuilder(ER_TILE_INVALID_SIZE).build();
    }
    for (const tile of obj.tile_devices) {
        buf.writeInt16LE(tile.accel_meas_x, offset);
        offset += 2;
        buf.writeInt16LE(tile.accel_meas_y, offset);
        offset += 2;
        buf.writeInt16LE(tile.accel_meas_z, offset);
        offset += 2;
        /** reserved */
        offset += 2;
        buf.writeFloatLE(tile.user_x, offset);
        offset += 4;
        buf.writeFloatLE(tile.user_y, offset);
        offset += 4;
        buf.writeUInt8(tile.width, offset);
        offset += 1;
        buf.writeUInt8(tile.height, offset);
        offset += 1;
        /** reserved */
        offset += 1;
        buf.writeUInt32LE(tile.device_version_vendor, offset);
        offset += 4;
        buf.writeUInt32LE(tile.device_version_product, offset);
        offset += 4;
        buf.writeUInt32LE(tile.device_version_version, offset);
        offset += 4;
        utils.writeUInt64LE(buf, tile.firmware_build, offset);
        offset += 8;
        /** reserved */
        offset += 8;
        buf.writeUInt16LE(tile.firmware_version_minor, offset);
        offset += 2;
        buf.writeUInt16LE(tile.firmware_version_major, offset);
        offset += 2;
        /** reserved */
        offset += 4;
    }
    buf.writeUInt8(obj.total_count, offset);
    offset += 1;
    return buf;
}
export const stateDeviceChain = {
    type: 702,
    name: 'stateDeviceChain',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateDeviceChain.js.map
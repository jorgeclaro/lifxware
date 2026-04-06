import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 661;
function toObject(buf) {
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    let offset = 0;
    const count = buf.readUInt16LE(offset);
    offset += 2;
    const index = buf.readUInt16LE(offset);
    offset += 2;
    const colorsCount = buf.readUInt8(offset);
    offset += 1;
    const colors = [];
    for (let i = 0; i < 82; i++) {
        colors.push({
            hue: buf.readUInt16LE(offset),
            saturation: buf.readUInt16LE(offset + 2),
            brightness: buf.readUInt16LE(offset + 4),
            kelvin: buf.readUInt16LE(offset + 6)
        });
        offset += 8;
    }
    return {
        count,
        index,
        colorsCount,
        colors
    };
}
export const stateExtendedColorZones = {
    type: 512,
    name: 'stateExtendedColorZones',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject
};
//# sourceMappingURL=stateExtendedColorZones.js.map
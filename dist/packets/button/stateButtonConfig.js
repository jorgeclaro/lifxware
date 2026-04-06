import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 18;
function toObject(buf) {
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    return {
        hapticDurationMs: buf.readUInt16LE(0),
        backlightOnColor: {
            hue: buf.readUInt16LE(2),
            saturation: buf.readUInt16LE(4),
            brightness: buf.readUInt16LE(6),
            kelvin: buf.readUInt16LE(8)
        },
        backlightOffColor: {
            hue: buf.readUInt16LE(10),
            saturation: buf.readUInt16LE(12),
            brightness: buf.readUInt16LE(14),
            kelvin: buf.readUInt16LE(16)
        }
    };
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.writeUInt16LE(obj.hapticDurationMs, 0);
    buf.writeUInt16LE(obj.backlightOnColor.hue, 2);
    buf.writeUInt16LE(obj.backlightOnColor.saturation, 4);
    buf.writeUInt16LE(obj.backlightOnColor.brightness, 6);
    buf.writeUInt16LE(obj.backlightOnColor.kelvin, 8);
    buf.writeUInt16LE(obj.backlightOffColor.hue, 10);
    buf.writeUInt16LE(obj.backlightOffColor.saturation, 12);
    buf.writeUInt16LE(obj.backlightOffColor.brightness, 14);
    buf.writeUInt16LE(obj.backlightOffColor.kelvin, 16);
    return buf;
}
export const stateButtonConfig = {
    type: 911,
    name: 'stateButtonConfig',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=stateButtonConfig.js.map
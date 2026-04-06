const SIZE = 18;
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
export const setButtonConfig = {
    type: 910,
    name: 'setButtonConfig',
    legacy: false,
    size: SIZE,
    tagged: false,
    toBuffer
};
//# sourceMappingURL=setButtonConfig.js.map
const SIZE = 3;
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.writeUInt8(obj.relayIndex, 0);
    buf.writeUInt16LE(obj.level, 1);
    return buf;
}
export const setRelayPower = {
    type: 817,
    name: 'relaySetPower',
    legacy: false,
    size: SIZE,
    tagged: false,
    toBuffer
};
//# sourceMappingURL=setRelayPower.js.map
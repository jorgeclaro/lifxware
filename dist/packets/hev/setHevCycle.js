const SIZE = 5;
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.writeUInt8(obj.enable ? 1 : 0, 0);
    buf.writeUInt32LE(obj.durationS, 1);
    return buf;
}
export const setHevCycle = {
    type: 143,
    name: 'setHevCycle',
    legacy: false,
    size: SIZE,
    tagged: false,
    toBuffer
};
//# sourceMappingURL=setHevCycle.js.map
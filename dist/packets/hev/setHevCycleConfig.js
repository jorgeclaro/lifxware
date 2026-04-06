const SIZE = 5;
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.writeUInt8(obj.indication ? 1 : 0, 0);
    buf.writeUInt32LE(obj.durationS, 1);
    return buf;
}
export const setHevCycleConfig = {
    type: 146,
    name: 'setHevCycleConfig',
    legacy: false,
    size: SIZE,
    tagged: false,
    toBuffer
};
//# sourceMappingURL=setHevCycleConfig.js.map
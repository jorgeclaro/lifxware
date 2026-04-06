const SIZE = 1;
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.writeUInt8(obj.relayIndex, 0);
    return buf;
}
export const getRelayPower = {
    type: 816,
    name: 'relayGetPower',
    legacy: false,
    size: SIZE,
    tagged: false,
    toBuffer
};
//# sourceMappingURL=getRelayPower.js.map
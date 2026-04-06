const SIZE = 15;
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.writeUInt8(obj.tileIndex, 0);
    buf.writeUInt8(obj.length, 1);
    buf.writeUInt8(obj.srcFbIndex, 2);
    buf.writeUInt8(obj.dstFbIndex, 3);
    buf.writeUInt8(obj.srcX, 4);
    buf.writeUInt8(obj.srcY, 5);
    buf.writeUInt8(obj.dstX, 6);
    buf.writeUInt8(obj.dstY, 7);
    buf.writeUInt8(obj.width, 8);
    buf.writeUInt8(obj.height, 9);
    buf.writeUInt32LE(obj.duration, 10);
    buf.writeUInt8(0, 14);
    return buf;
}
export const copyFrameBuffer = {
    type: 716,
    name: 'copyFrameBuffer',
    legacy: false,
    size: SIZE,
    tagged: false,
    toBuffer
};
//# sourceMappingURL=copyFrameBuffer.js.map
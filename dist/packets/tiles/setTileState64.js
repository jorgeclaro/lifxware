import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 522;
const MAX_HSBK = 64;
//eslint-disable-next-line complexity
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.writeUInt8(obj.tile_index, offset);
    offset += 1;
    buf.writeUInt8(obj.length, offset);
    offset += 1;
    /** reserved */
    offset += 1;
    buf.writeUInt8(obj.x, offset);
    offset += 1;
    buf.writeUInt8(obj.y, offset);
    offset += 1;
    buf.writeUInt8(obj.width, offset);
    offset += 1;
    buf.writeUInt32LE(obj.duration, offset);
    offset += 4;
    for (const color of obj.colors) {
        buf.writeUInt16LE(color.hue, offset);
        offset += 2;
        buf.writeUInt16LE(color.saturation, offset);
        offset += 2;
        buf.writeUInt16LE(color.brightness, offset);
        offset += 2;
        buf.writeUInt16LE(color.kelvin, offset);
        offset += 2;
    }
    return buf;
}
//eslint-disable-next-line complexity
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    let obj;
    obj.tile_index = buf.readUInt8(offset);
    offset += 1;
    obj.length = buf.readUInt8(offset);
    offset += 1;
    /** reserved */
    offset += 1;
    obj.x = buf.readUInt8(offset);
    offset += 1;
    obj.y = buf.readUInt8(offset);
    offset += 1;
    obj.width = buf.readUInt8(offset);
    offset += 1;
    obj.duration = buf.readUInt32LE(offset);
    offset += 4;
    for (let i = 0; i < MAX_HSBK; i++) {
        let color;
        color.hue = buf.readUInt16LE(offset);
        offset += 2;
        color.saturation = buf.readUInt16LE(offset);
        offset += 2;
        color.brightness = buf.readUInt16LE(offset);
        offset += 2;
        color.kelvin = buf.readUInt16LE(offset);
        offset += 2;
        obj.colors.push(color);
    }
    return obj;
}
export const setTileState64 = {
    type: 715,
    name: 'setTileState64',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0VGlsZVN0YXRlNjQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy90aWxlcy9zZXRUaWxlU3RhdGU2NC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUduRSxNQUFNLElBQUksR0FBRyxHQUFHLENBQUM7QUFDakIsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBRXBCLHFDQUFxQztBQUNyQyxTQUFTLFFBQVEsQ0FBQyxHQUEwQjtJQUMzQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRS9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosZUFBZTtJQUNmLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFWixHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUIsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5QixNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xD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
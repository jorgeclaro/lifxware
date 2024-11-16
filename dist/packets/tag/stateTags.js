"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateTags = void 0;
const utils = require("../../lib/utils");
const error_1 = require("../../lib/error");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 8;
function toObject(buf) {
    const obj = {};
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    let label = utils.readUInt64LE(buf, offset).toString();
    label = label.replace(/\0[\s\S]*$/g, '');
    offset += 2;
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    utils.writeUInt64LE(buf, offset, obj.tags);
    offset += 2;
    return buf;
}
exports.stateTags = {
    type: 28,
    name: 'stateTags',
    legacy: true,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVUYWdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvdGFnL3N0YXRlVGFncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBeUM7QUFHekMsMkNBQXNEO0FBQ3RELDREQUFtRTtBQUVuRSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7QUFFZixTQUFTLFFBQVEsQ0FBQyxHQUFXO0lBQzVCLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNmLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7UUFDeEIsTUFBTSxJQUFJLDJCQUFtQixDQUFDLHFDQUFzQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDOUQ7SUFFRCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUV2RCxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQVE7SUFDekIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUvQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1osSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosT0FBTyxHQUFHLENBQUM7QUFDWixDQUFDO0FBRVksUUFBQSxTQUFTLEdBQXNCO0lBQzNDLElBQUksRUFBRSxFQUFFO0lBQ1IsSUFBSSxFQUFFLFdBQVc7SUFDakIsTUFBTSxFQUFFLElBQUk7SUFDWixJQUFJLEVBQUUsSUFBSTtJQUNWLE1BQU0sRUFBRSxLQUFLO0lBQ2IsUUFBUTtJQUNSLFFBQVE7Q0FDUixDQUFDIn0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDimAbsolute = void 0;
const colorHSBK_1 = require("../color/colorHSBK");
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 6;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    const brightness = buf.readUInt16LE(offset);
    offset += 2;
    const fadetime = buf.readUInt32LE(offset);
    offset += 4;
    const obj = {
        brightness,
        fadeTime: fadetime
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.brightness !== colorHSBK_1.HSBK_MINIMUM_RAW && obj.brightness !== colorHSBK_1.HSBK_MINIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be ' + colorHSBK_1.HSBK_MINIMUM_RAW + ' or ' + colorHSBK_1.HSBK_MAXIMUM_RAW + ' only')
            .build();
    }
    buf.writeUInt16LE(obj.brightness, offset);
    offset += 2;
    /** Duration is 0 by default */
    if (obj.fadeTime) {
        buf.writeUInt32LE(obj.fadeTime, offset);
    }
    offset += 4;
    return buf;
}
exports.setDimAbsolute = {
    type: 104,
    name: 'setDimAbsolute',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0RGltQWJzb2x1dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy9kaW1tZXIvc2V0RGltQWJzb2x1dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsa0RBQXdFO0FBQ3hFLDJDQUFzRDtBQUN0RCwwREFBZ0U7QUFDaEUsNERBQW1FO0FBRW5FLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztBQUVmLFNBQVMsUUFBUSxDQUFDLEdBQVc7SUFDNUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtRQUN4QixNQUFNLElBQUksMkJBQW1CLENBQUMscUNBQXNCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM5RDtJQUVELE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFNUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFMUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sR0FBRyxHQUF1QjtRQUMvQixVQUFVO1FBQ1YsUUFBUSxFQUFFLFFBQVE7S0FDbEIsQ0FBQztJQUVGLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQXVCO0lBQ3hDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLElBQUksR0FBRyxDQUFDLFVBQVUsS0FBSyw0QkFBZ0IsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLDRCQUFnQixFQUFFO1FBQy9FLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQzthQUNqRCxxQkFBcUIsQ0FDckIsaUNBQWlDLEdBQUcsNEJBQWdCLEdBQUcsTUFBTSxHQUFHLDRCQUFnQixHQUFHLE9BQU8sQ0FDMUY7YUFDQSxLQUFLLEVBQUUsQ0FBQztLQUNWO0lBRUQsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFWiwrQkFBK0I7SUFDL0IsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO1FBQ2pCLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUN4QztJQUNELE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFWixPQUFPLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFFWSxRQUFBLGNBQWMsR0FBc0I7SUFDaEQsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsS0FBSztJQUNiLFFBQVE7SUFDUixRQUFRO0NBQ1IsQ0FBQyJ9
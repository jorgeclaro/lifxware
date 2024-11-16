"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDimRelative = void 0;
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
    const fadeTime = buf.readUInt32LE(offset);
    offset += 4;
    const obj = {
        brightness,
        fadeTime
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.brightness !== colorHSBK_1.HSBK_MINIMUM_RAW && obj.brightness !== colorHSBK_1.HSBK_MAXIMUM_RAW) {
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
exports.setDimRelative = {
    type: 105,
    name: 'setDimRelative',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0RGltUmVsYXRpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy9kaW1tZXIvc2V0RGltUmVsYXRpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsa0RBQXdFO0FBQ3hFLDJDQUFzRDtBQUN0RCwwREFBZ0U7QUFDaEUsNERBQW1FO0FBRW5FLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztBQUVmLFNBQVMsUUFBUSxDQUFDLEdBQVc7SUFDNUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtRQUN4QixNQUFNLElBQUksMkJBQW1CLENBQUMscUNBQXNCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM5RDtJQUVELE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFNUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFMUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sR0FBRyxHQUF1QjtRQUMvQixVQUFVO1FBQ1YsUUFBUTtLQUNSLENBQUM7SUFFRixPQUFPLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxHQUF1QjtJQUN4QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRS9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssNEJBQWdCLElBQUksR0FBRyxDQUFDLFVBQVUsS0FBSyw0QkFBZ0IsRUFBRTtRQUMvRSxNQUFNLElBQUksMkJBQW1CLENBQUMsa0NBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLGlDQUFpQyxHQUFHLDRCQUFnQixHQUFHLE1BQU0sR0FBRyw0QkFBZ0IsR0FBRyxPQUFPLENBQzFGO2FBQ0EsS0FBSyxFQUFFLENBQUM7S0FDVjtJQUVELEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosK0JBQStCO0lBQy9CLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtRQUNqQixHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDeEM7SUFDRCxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosT0FBTyxHQUFHLENBQUM7QUFDWixDQUFDO0FBRVksUUFBQSxjQUFjLEdBQXNCO0lBQ2hELElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixNQUFNLEVBQUUsS0FBSztJQUNiLElBQUksRUFBRSxJQUFJO0lBQ1YsTUFBTSxFQUFFLEtBQUs7SUFDYixRQUFRO0lBQ1IsUUFBUTtDQUNSLENBQUMifQ==
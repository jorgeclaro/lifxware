"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setInfrared = void 0;
const colorHSBK_1 = require("../color/colorHSBK");
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 2;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    const brightness = buf.readUInt16LE(offset);
    offset += 2;
    const obj = {
        brightness
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.brightness < colorHSBK_1.HSBK_MINIMUM_RAW && obj.brightness > colorHSBK_1.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' + colorHSBK_1.HSBK_MINIMUM_RAW + ' and ' + colorHSBK_1.HSBK_MAXIMUM_RAW)
            .build();
    }
    buf.writeUInt16LE(obj.brightness, offset);
    offset += 2;
    return buf;
}
exports.setInfrared = {
    type: 122,
    name: 'setInfrared',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0SW5mcmFyZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy9pbmZyYXJlZC9zZXRJbmZyYXJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxrREFBd0U7QUFDeEUsMkNBQXNEO0FBQ3RELDBEQUFnRTtBQUNoRSw0REFBbUU7QUFFbkUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBRWYsU0FBUyxRQUFRLENBQUMsR0FBVztJQUM1QixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO1FBQ3hCLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxxQ0FBc0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzlEO0lBRUQsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU1QyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosTUFBTSxHQUFHLEdBQWtCO1FBQzFCLFVBQVU7S0FDVixDQUFDO0lBRUYsT0FBTyxHQUFHLENBQUM7QUFDWixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsR0FBeUI7SUFDMUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUvQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1osSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLDRCQUFnQixJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsNEJBQWdCLEVBQUU7UUFDM0UsTUFBTSxJQUFJLDJCQUFtQixDQUFDLGtDQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUNyQixrREFBa0QsR0FBRyw0QkFBZ0IsR0FBRyxPQUFPLEdBQUcsNEJBQWdCLENBQ2xHO2FBQ0EsS0FBSyxFQUFFLENBQUM7S0FDVjtJQUNELEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosT0FBTyxHQUFHLENBQUM7QUFDWixDQUFDO0FBRVksUUFBQSxXQUFXLEdBQXNCO0lBQzdDLElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLGFBQWE7SUFDbkIsTUFBTSxFQUFFLEtBQUs7SUFDYixJQUFJLEVBQUUsSUFBSTtJQUNWLE1BQU0sRUFBRSxLQUFLO0lBQ2IsUUFBUTtJQUNSLFFBQVE7Q0FDUixDQUFDIn0=
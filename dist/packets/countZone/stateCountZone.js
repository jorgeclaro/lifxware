"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateCountZone = void 0;
const utils = require("../../lib/utils");
const error_1 = require("../../lib/error");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 9;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    const time = utils.readUInt64LE(buf, offset);
    offset += 8;
    const count = buf.readUInt8(offset);
    offset += 1;
    const obj = {
        time,
        count
    };
    return obj;
}
exports.stateCountZone = {
    type: 505,
    name: 'stateCountZone',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVDb3VudFpvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy9jb3VudFpvbmUvc3RhdGVDb3VudFpvbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQXlDO0FBR3pDLDJDQUFzRDtBQUN0RCw0REFBbUU7QUFFbkUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBRWYsU0FBUyxRQUFRLENBQUMsR0FBVztJQUM1QixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO1FBQ3hCLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxxQ0FBc0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzlEO0lBRUQsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFN0MsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sR0FBRyxHQUFjO1FBQ3RCLElBQUk7UUFDSixLQUFLO0tBQ0wsQ0FBQztJQUVGLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVZLFFBQUEsY0FBYyxHQUFzQjtJQUNoRCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsTUFBTSxFQUFFLEtBQUs7SUFDYixJQUFJLEVBQUUsSUFBSTtJQUNWLE1BQU0sRUFBRSxLQUFLO0lBQ2IsUUFBUTtDQUNSLENBQUMifQ==
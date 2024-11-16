"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPower = void 0;
const power_1 = require("./power");
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 6;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    const power = buf.readUInt16LE(offset);
    offset += 2;
    const duration = buf.readUInt32LE(offset);
    offset += 4;
    const obj = {
        power,
        duration
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.power !== power_1.POWER_MINIMUM_RAW && obj.power !== power_1.POWER_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage(`Invalid level given for setPower LIFX packet, only ${power_1.POWER_MINIMUM_RAW} and ${power_1.POWER_MAXIMUM_RAW} are supported`)
            .build();
    }
    buf.writeUInt16LE(obj.power, offset);
    offset += 2;
    /** Duration is 0 by default */
    if (obj.duration) {
        buf.writeUInt32LE(obj.duration, offset);
    }
    offset += 4;
    return buf;
}
exports.setPower = {
    type: 117,
    name: 'setPower',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0UG93ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy9wb3dlci9zZXRQb3dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBNkU7QUFFN0UsMkNBQXNEO0FBQ3RELDBEQUFnRTtBQUNoRSw0REFBbUU7QUFFbkUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBRWYsU0FBUyxRQUFRLENBQUMsR0FBVztJQUM1QixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO1FBQ3hCLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxxQ0FBc0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzlEO0lBRUQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV2QyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUUxQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosTUFBTSxHQUFHLEdBQWlCO1FBQ3pCLEtBQUs7UUFDTCxRQUFRO0tBQ1IsQ0FBQztJQUVGLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQWlCO0lBQ2xDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyx5QkFBaUIsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLHlCQUFpQixFQUFFO1FBQ3ZFLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQzthQUNqRCxxQkFBcUIsQ0FDckIsc0RBQXNELHlCQUFpQixRQUFRLHlCQUFpQixnQkFBZ0IsQ0FDaEg7YUFDQSxLQUFLLEVBQUUsQ0FBQztLQUNWO0lBQ0QsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFWiwrQkFBK0I7SUFDL0IsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO1FBQ2pCLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUN4QztJQUNELE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFWixPQUFPLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFFWSxRQUFBLFFBQVEsR0FBc0I7SUFDMUMsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsVUFBVTtJQUNoQixNQUFNLEVBQUUsS0FBSztJQUNiLElBQUksRUFBRSxJQUFJO0lBQ1YsTUFBTSxFQUFFLEtBQUs7SUFDYixRQUFRO0lBQ1IsUUFBUTtDQUNSLENBQUMifQ==
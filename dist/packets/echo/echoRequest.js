"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.echoRequest = void 0;
const error_1 = require("../../lib/error");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 64;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    const payload = buf.toString('utf8', offset, offset + 64);
    offset += 64;
    const obj = {
        payload
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.write(obj.payload, offset, 64);
    offset += 64;
    return buf;
}
exports.echoRequest = {
    type: 58,
    name: 'echoRequest',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNob1JlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy9lY2hvL2VjaG9SZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDJDQUFzRDtBQUN0RCw0REFBbUU7QUFFbkUsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRWhCLFNBQVMsUUFBUSxDQUFDLEdBQVc7SUFDNUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtRQUN4QixNQUFNLElBQUksMkJBQW1CLENBQUMscUNBQXNCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM5RDtJQUVELE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFFMUQsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUViLE1BQU0sR0FBRyxHQUFnQjtRQUN4QixPQUFPO0tBQ1AsQ0FBQztJQUVGLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQWdCO0lBQ2pDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUViLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVZLFFBQUEsV0FBVyxHQUFzQjtJQUM3QyxJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxhQUFhO0lBQ25CLE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsS0FBSztJQUNiLFFBQVE7SUFDUixRQUFRO0NBQ1IsQ0FBQyJ9
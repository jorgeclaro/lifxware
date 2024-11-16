"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.echoResponse = void 0;
const error_1 = require("../../lib/error");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 64;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    let payload = buf.toString('utf8', offset, offset + 64);
    payload = payload.replace(/\0/g, '');
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
exports.echoResponse = {
    type: 59,
    name: 'echoResponse',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNob1Jlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvZWNoby9lY2hvUmVzcG9uc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsMkNBQXNEO0FBQ3RELDREQUFtRTtBQUVuRSxNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7QUFFaEIsU0FBUyxRQUFRLENBQUMsR0FBVztJQUM1QixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO1FBQ3hCLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxxQ0FBc0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzlEO0lBRUQsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztJQUV4RCxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDckMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUViLE1BQU0sR0FBRyxHQUFpQjtRQUN6QixPQUFPO0tBQ1AsQ0FBQztJQUVGLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQWlCO0lBQ2xDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUViLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVZLFFBQUEsWUFBWSxHQUFzQjtJQUM5QyxJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxjQUFjO0lBQ3BCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsS0FBSztJQUNiLFFBQVE7SUFDUixRQUFRO0NBQ1IsQ0FBQyJ9
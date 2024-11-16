"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateInfrared = void 0;
const error_1 = require("../../lib/error");
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
    buf.writeUInt16LE(obj.brightness, offset);
    offset += 2;
    return buf;
}
exports.stateInfrared = {
    type: 121,
    name: 'stateInfrared',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVJbmZyYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWNrZXRzL2luZnJhcmVkL3N0YXRlSW5mcmFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsMkNBQXNEO0FBQ3RELDREQUFtRTtBQUVuRSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7QUFFZixTQUFTLFFBQVEsQ0FBQyxHQUFXO0lBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7UUFDeEIsTUFBTSxJQUFJLDJCQUFtQixDQUFDLHFDQUFzQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDOUQ7SUFFRCxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTVDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFWixNQUFNLEdBQUcsR0FBa0I7UUFDMUIsVUFBVTtLQUNWLENBQUM7SUFFRixPQUFPLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxHQUF5QjtJQUMxQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRS9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVZLFFBQUEsYUFBYSxHQUFzQjtJQUMvQyxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxlQUFlO0lBQ3JCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsS0FBSztJQUNiLFFBQVE7SUFDUixRQUFRO0NBQ1IsQ0FBQyJ9
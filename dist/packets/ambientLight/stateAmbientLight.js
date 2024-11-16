"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateAmbientLight = void 0;
const error_1 = require("../../lib/error");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 4;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    const flux = buf.readFloatLE(offset);
    offset += 4;
    const obj = {
        flux
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.writeFloatLE(obj.flux, offset);
    offset += 4;
    return buf;
}
exports.stateAmbientLight = {
    type: 402,
    name: 'stateAmbientLight',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVBbWJpZW50TGlnaHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy9hbWJpZW50TGlnaHQvc3RhdGVBbWJpZW50TGlnaHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsMkNBQXNEO0FBQ3RELDREQUFtRTtBQUVuRSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7QUFFZixTQUFTLFFBQVEsQ0FBQyxHQUFXO0lBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7UUFDeEIsTUFBTSxJQUFJLDJCQUFtQixDQUFDLHFDQUFzQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDOUQ7SUFFRCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXJDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFWixNQUFNLEdBQUcsR0FBaUI7UUFDekIsSUFBSTtLQUNKLENBQUM7SUFFRixPQUFPLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxHQUFpQjtJQUNsQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRS9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVZLFFBQUEsaUJBQWlCLEdBQXNCO0lBQ25ELElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLG1CQUFtQjtJQUN6QixNQUFNLEVBQUUsS0FBSztJQUNiLElBQUksRUFBRSxJQUFJO0lBQ1YsTUFBTSxFQUFFLEtBQUs7SUFDYixRQUFRO0lBQ1IsUUFBUTtDQUNSLENBQUMifQ==
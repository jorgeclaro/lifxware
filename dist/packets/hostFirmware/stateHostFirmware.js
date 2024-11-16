"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateHostFirmware = void 0;
const utils = require("../../lib/utils");
const error_1 = require("../../lib/error");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 20;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    const build = utils.readUInt64LE(buf, offset);
    offset += 8;
    const install = utils.readUInt64LE(buf, offset);
    offset += 8;
    const version = buf.readUInt32LE(offset);
    const majorVersion = (version >> 16) & 0xff;
    const minorVersion = version & 0xff;
    offset += 4;
    const obj = {
        build,
        install,
        version,
        majorVersion,
        minorVersion
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    utils.writeUInt64LE(buf, offset, obj.build);
    offset += 8;
    utils.writeUInt64LE(buf, offset, obj.install);
    offset += 8;
    buf.writeUInt32LE(obj.version, offset);
    offset += 4;
    return buf;
}
exports.stateHostFirmware = {
    type: 15,
    name: 'stateHostFirmware',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVIb3N0RmlybXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy9ob3N0RmlybXdhcmUvc3RhdGVIb3N0RmlybXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQXlDO0FBR3pDLDJDQUFzRDtBQUN0RCw0REFBbUU7QUFFbkUsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRWhCLFNBQVMsUUFBUSxDQUFDLEdBQVc7SUFDNUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtRQUN4QixNQUFNLElBQUksMkJBQW1CLENBQUMscUNBQXNCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM5RDtJQUVELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRTlDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFWixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVoRCxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QyxNQUFNLFlBQVksR0FBRyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDNUMsTUFBTSxZQUFZLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztJQUVwQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosTUFBTSxHQUFHLEdBQWlCO1FBQ3pCLEtBQUs7UUFDTCxPQUFPO1FBQ1AsT0FBTztRQUNQLFlBQVk7UUFDWixZQUFZO0tBQ1osQ0FBQztJQUVGLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQWlCO0lBQ2xDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2QyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosT0FBTyxHQUFHLENBQUM7QUFDWixDQUFDO0FBRVksUUFBQSxpQkFBaUIsR0FBc0I7SUFDbkQsSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUUsbUJBQW1CO0lBQ3pCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsS0FBSztJQUNiLFFBQVE7SUFDUixRQUFRO0NBQ1IsQ0FBQyJ9
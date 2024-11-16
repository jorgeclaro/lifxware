"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateZone = void 0;
const colorHSBK_1 = require("../color/colorHSBK");
const colorHSBK_2 = require("../color/colorHSBK");
const colorZone_1 = require("./colorZone");
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 10;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    const count = buf.readUInt8(offset);
    offset += 1;
    const index = buf.readUInt8(offset);
    offset += 1;
    const hue = buf.readUInt16LE(offset);
    offset += 2;
    const saturation = buf.readUInt16LE(offset);
    offset += 2;
    const brightness = buf.readUInt16LE(offset);
    offset += 2;
    const kelvin = buf.readUInt16LE(offset);
    offset += 2;
    const color = {
        hue,
        saturation,
        brightness,
        kelvin
    };
    const obj = {
        count,
        index,
        color
    };
    return obj;
}
/**
 * Converts the given packet specific object into a packet
 * @param obj object with configuration data
 * @return packet
 */
//eslint-disable-next-line complexity
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.count < colorZone_1.ZONE_INDEX_MINIMUM_VALUE || obj.count > colorZone_1.ZONE_INDEX_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid count value given for stateColorZone LIFX packet, must be a number between ' +
            colorZone_1.ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            colorZone_1.ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.count, offset);
    offset += 1;
    if (obj.index < colorZone_1.ZONE_INDEX_MINIMUM_VALUE || obj.index > colorZone_1.ZONE_INDEX_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid index value given for stateColorZone LIFX packet, must be a number between ' +
            colorZone_1.ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            colorZone_1.ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.index, offset);
    offset += 1;
    if (obj.color.hue < colorHSBK_1.HSBK_MINIMUM_RAW || obj.color.hue > colorHSBK_1.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects hue to be a number between ' + colorHSBK_1.HSBK_MINIMUM_RAW + ' and ' + colorHSBK_1.HSBK_MAXIMUM_RAW)
            .build();
    }
    buf.writeUInt16LE(obj.color.hue, offset);
    offset += 2;
    if (obj.color.saturation < colorHSBK_1.HSBK_MINIMUM_RAW || obj.color.saturation > colorHSBK_1.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects saturation to be a number between ' + colorHSBK_1.HSBK_MINIMUM_RAW + ' and ' + colorHSBK_1.HSBK_MAXIMUM_RAW)
            .build();
    }
    buf.writeUInt16LE(obj.color.saturation, offset);
    offset += 2;
    if (obj.color.brightness < colorHSBK_1.HSBK_MINIMUM_RAW || obj.color.brightness > colorHSBK_1.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' + colorHSBK_1.HSBK_MINIMUM_RAW + ' and ' + colorHSBK_1.HSBK_MAXIMUM_RAW)
            .build();
    }
    buf.writeUInt16LE(obj.color.brightness, offset);
    offset += 2;
    if (!obj.color.kelvin) {
        obj.color.kelvin = colorHSBK_2.HSBK_DEFAULT_KELVIN;
    }
    if (obj.color.kelvin < colorHSBK_1.HSBK_MINIMUM_KELVIN || obj.color.kelvin > colorHSBK_1.HSBK_MAXIMUM_KELVIN) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects kelvin to be a number between ' + colorHSBK_1.HSBK_MINIMUM_KELVIN + ' and ' + colorHSBK_1.HSBK_MAXIMUM_KELVIN)
            .build();
    }
    buf.writeUInt16LE(obj.color.kelvin, offset);
    offset += 2;
    return buf;
}
exports.stateZone = {
    type: 503,
    name: 'stateColorZone',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVDb2xvclpvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy9jb2xvclpvbmUvc3RhdGVDb2xvclpvbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0RBTTRCO0FBQzVCLGtEQUF5RDtBQUN6RCwyQ0FBNEY7QUFFNUYsMkNBQXNEO0FBQ3RELDBEQUFnRTtBQUNoRSw0REFBbUU7QUFFbkUsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRWhCLFNBQVMsUUFBUSxDQUFDLEdBQVc7SUFDNUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtRQUN4QixNQUFNLElBQUksMkJBQW1CLENBQUMscUNBQXNCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM5RDtJQUVELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFckMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUNaLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFNUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUNaLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFNUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUNaLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFeEMsTUFBTSxJQUFJLENBQUMsQ0FB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
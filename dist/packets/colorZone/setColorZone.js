"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setColorZone = void 0;
const colorZone_1 = require("./colorZone");
const colorHSBK_1 = require("../color/colorHSBK");
const colorHSBK_2 = require("../color/colorHSBK");
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 15;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    const startIndex = buf.readUInt8(offset);
    offset += 1;
    const endIndex = buf.readUInt8(offset);
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
    const duration = buf.readUInt32LE(offset);
    offset += 4;
    const apply = buf.readUInt8(offset);
    offset += 1;
    const obj = {
        startIndex,
        endIndex,
        color,
        duration,
        apply
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
    if (obj.startIndex < colorZone_1.ZONE_INDEX_MINIMUM_VALUE || obj.startIndex > colorZone_1.ZONE_INDEX_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid startIndex value given for setColorZones LIFX packet, must be a number between ' +
            colorZone_1.ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            colorZone_1.ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.startIndex, offset);
    offset += 1;
    if (obj.endIndex < colorZone_1.ZONE_INDEX_MINIMUM_VALUE || obj.endIndex > colorZone_1.ZONE_INDEX_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid endIndex value given for setColorZones LIFX packet, must be a number between ' +
            colorZone_1.ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            colorZone_1.ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.endIndex, offset);
    offset += 1;
    if (obj.color.hue < colorHSBK_1.HSBK_MINIMUM_RAW || obj.color.hue > colorHSBK_1.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' + colorHSBK_1.HSBK_MINIMUM_RAW + ' and ' + colorHSBK_1.HSBK_MAXIMUM_RAW)
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
    /** Duration is 0 by default */
    if (obj.duration) {
        buf.writeUInt32LE(obj.duration, offset);
    }
    offset += 4;
    if (obj.apply < 0 || obj.apply > 2) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid apply value given for setColorZones LIFX packet, must be a number between 0 and 2')
            .build();
    }
    buf.writeUInt8(obj.apply, offset);
    offset += 1;
    return buf;
}
exports.setColorZone = {
    type: 501,
    name: 'setColorZone',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0Q29sb3Jab25lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvY29sb3Jab25lL3NldENvbG9yWm9uZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBb0c7QUFDcEcsa0RBTTRCO0FBQzVCLGtEQUF5RDtBQUV6RCwyQ0FBc0Q7QUFDdEQsMERBQWdFO0FBQ2hFLDREQUFtRTtBQUVuRSxNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7QUFFaEIsU0FBUyxRQUFRLENBQUMsR0FBVztJQUM1QixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO1FBQ3hCLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxxQ0FBc0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzlEO0lBRUQsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV6QyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV2QyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVyQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBQ1osTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU1QyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBQ1osTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU1QyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBQ1osTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV4QyxNQUFNLElBQUksQ0FBQyxDQUFDO0lB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
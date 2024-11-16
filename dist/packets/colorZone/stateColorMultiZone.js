"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateMultiZone = void 0;
const colorHSBK_1 = require("../color/colorHSBK");
const colorHSBK_2 = require("../color/colorHSBK");
const colorZone_1 = require("./colorZone");
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 10;
function toObject(buf) {
    let offset = 0;
    if (buf.length < SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE)
            .withContextualMessage('Invalid length for LIFX packet, expected minimum 10 but received ' + buf.length)
            .build();
    }
    const count = buf.readUInt8(offset);
    offset += 1;
    const index = buf.readUInt8(offset);
    offset += 1;
    const colors = [];
    while (buf.length - offset >= 8) {
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
        colors.push(color);
    }
    const obj = {
        count,
        index,
        color: colors
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.count < colorZone_1.ZONE_INDEX_MINIMUM_VALUE || obj.count > colorZone_1.ZONE_INDEX_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid count value given for stateColorMultiZone LIFX packet, must be a number between ' +
            colorZone_1.ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            colorZone_1.ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.count, offset);
    offset += 1;
    if (obj.index < colorZone_1.ZONE_INDEX_MINIMUM_VALUE || obj.index > colorZone_1.ZONE_INDEX_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid index value given for stateColorMultiZone LIFX packet, must be a number between ' +
            colorZone_1.ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            colorZone_1.ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.index, offset);
    offset += 1;
    if (obj.color.length < 1 || obj.color.length > 8) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid set of color values given for stateColorMultiZone LIFX packet, must be an array of 1 to 8 objects')
            .build();
    }
    //eslint-disable-next-line complexity
    obj.color.forEach(function (colorObj, index) {
        if (colorObj.hue < colorHSBK_1.HSBK_MINIMUM_RAW || colorObj.hue > colorHSBK_1.HSBK_MAXIMUM_RAW) {
            throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
                .withContextualMessage('Invalid color hue given at index ' +
                index +
                ', must be a number between ' +
                colorHSBK_1.HSBK_MINIMUM_RAW +
                ' and ' +
                colorHSBK_1.HSBK_MAXIMUM_RAW)
                .build();
        }
        buf.writeUInt16LE(colorObj.hue, offset);
        offset += 2;
        if (colorObj.saturation < colorHSBK_1.HSBK_MINIMUM_RAW || colorObj.saturation > colorHSBK_1.HSBK_MAXIMUM_RAW) {
            throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
                .withContextualMessage('Invalid color saturation given at index ' +
                index +
                ', must be a number between ' +
                colorHSBK_1.HSBK_MINIMUM_RAW +
                ' and ' +
                colorHSBK_1.HSBK_MAXIMUM_RAW)
                .build();
        }
        buf.writeUInt16LE(colorObj.saturation, offset);
        offset += 2;
        if (colorObj.brightness < colorHSBK_1.HSBK_MINIMUM_RAW || colorObj.brightness > colorHSBK_1.HSBK_MAXIMUM_RAW) {
            throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
                .withContextualMessage('Invalid color brightness given at index ' +
                index +
                ', must be a number between ' +
                colorHSBK_1.HSBK_MINIMUM_RAW +
                ' and ' +
                colorHSBK_1.HSBK_MAXIMUM_RAW)
                .build();
        }
        buf.writeUInt16LE(colorObj.brightness, offset);
        offset += 2;
        if (!colorObj.kelvin) {
            colorObj.kelvin = colorHSBK_2.HSBK_DEFAULT_KELVIN;
        }
        if (colorObj.kelvin < colorHSBK_1.HSBK_MINIMUM_KELVIN || colorObj.kelvin > colorHSBK_1.HSBK_MAXIMUM_KELVIN) {
            throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
                .withContextualMessage('Invalid color kelvin given at index ' +
                index +
                ', must be a number between ' +
                colorHSBK_1.HSBK_MINIMUM_RAW +
                ' and ' +
                colorHSBK_1.HSBK_MAXIMUM_RAW)
                .build();
        }
        buf.writeUInt16LE(colorObj.kelvin, offset);
        offset += 2;
    });
    return buf;
}
exports.stateMultiZone = {
    type: 506,
    name: 'stateColorMultiZone',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVDb2xvck11bHRpWm9uZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWNrZXRzL2NvbG9yWm9uZS9zdGF0ZUNvbG9yTXVsdGlab25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtEQU00QjtBQUM1QixrREFBeUQ7QUFDekQsMkNBQTRGO0FBRTVGLDJDQUFzRDtBQUN0RCwwREFBZ0U7QUFDaEUsNERBQW1FO0FBRW5FLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUVoQixTQUFTLFFBQVEsQ0FBQyxHQUFXO0lBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUU7UUFDdEIsTUFBTSxJQUFJLDJCQUFtQixDQUFDLHFDQUFzQixDQUFDO2FBQ25ELHFCQUFxQixDQUFDLG1FQUFtRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7YUFDdkcsS0FBSyxFQUFFLENBQUM7S0FDVjtJQUVELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sTUFBTSxHQUFnQixFQUFFLENBQUM7SUFFL0IsT0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDaEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVyQyxNQUFNLElBQUksQ0FBQyxDQUFDO1FBQ1osTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU1QyxNQUFNLElBQUksQ0FBQyxDQUFDO1FBQ1osTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU1QyxNQUFNLElBQUksQ0FBQyxDQUFDO1FBQ1osTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV4QyxNQUFNLElBQUksQ0FBQyxDQUFDO1FBRVosTUFBTSxLQUFLLEdBQWM7WUFDeEIsR0FBRztZQUNILFVBQVU7WUFDVixVQUFVO1lBQ1YsTUFBTTtTQUNOLENBQUM7UUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ25CO0lBRUQsTUFBTSxHQUFHLEdBQWM7UUFDdEIsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLLEVBQUUsTUFBTTtLQUNiLENBQUM7SUFFRixPQUFPLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxHQUFjO0lBQy9CLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxvQ0FBd0IsSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLG9DQUF3QixFQUFFO1FBQ2pGLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQzthQUNqRCxxQkFBcUIsQ0FDckIsMEZBQTBGO1lBQ3pGLG9DQUF3QjtZQUN4QixPQUFPO1lBQ1Asb0NBQXdCLENBQ3pCO2FBQ0EsS0FBSyxFQUFFLENBQUM7S0FDVjtJQUNELEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLG9DQUF3QixJQUFJLEdBQUcsQ0FBQyxLQUFLLEdBQUcsb0NBQXdCLEVBQUU7UUFDakYsTUFBTSxJQUFJLDJCQUFtQixDQUFDLGtDQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUNyQiwwRkFBMEY7WUFDekYsb0NBQXdCO1lBQ3hCLE9BQU87WUFDUCxvQ0FBd0IsQ0FDekI7YUFDQSxLQUFLLEVBQUUsQ0FBQztLQUNWO0lBQ0QsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFWixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDakQsTUFBTSxJQUFJLDJCQUFtQixDQUFDLGtDQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUNyQiwyR0FBMkcsQ0FDM0c7YUFDQSxLQUFLLEVBQUUsQ0FBQztLQUNWO0lBRUQscUNBQXFDO0lBQ3JDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUSxFQUFFLEtBQUs7UUFDekMsSUFBSSxRQUFRLENBQUMsR0FBRyxHQUFHLDRCQUFnQixJQUFJLFFBQVEsQ0FBQyxHQUFHLEdBQUcsNEJBQWdCLEVBQUU7WUFDdkUsTUFBTSxJQUFJLDJCQUFtQixDQUFDLGtDQUFvQixDQUFDO2lCQUNqRCxxQkFBcUIsQ0FDckIsbUNBQW1DO2dCQUNsQyxLQUFLO2dCQUNMLDZCQUE2QjtnQkFDN0IsNEJBQWdCO2dCQUNoQixPQUFPO2dCQUNQLDRCQUFnQixDQUNqQjtpQkFDQSxLQUFLLEVBQUUsQ0FBQztTQUNWO1FBQ0QsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFFWixJQUFJLFFBQVEsQ0FBQyxVQUFVLEdBQUcsNEJBQWdCLElBQUksUUFBUSxDQUFDLFVBQVUsR0FBRyw0QkFBZ0IsRUFBRTtZQUNyRixNQUFNLElBQUksMkJBQW1CLENBQUMsa0NBQW9CLENBQUM7aUJBQ2pELHFCQUFxQixDQUNyQiwwQ0FBMEM7Z0JBQ3pDLEtBQUs7Z0JBQ0wsNkJBQTZCO2dCQUM3Qiw0QkFBZ0I7Z0JBQ2hCLE9BQU87Z0JBQ1AsNEJBQWdCLENBQ2pCO2lCQUNBLEtBQUssRUFBRSxDQUFDO1NBQ1Y7UUFDRCxHQUFHLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0MsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUVaLElBQUksUUFBUSxDQUFDLFVBQVUsR0FBRyw0QkFBZ0IsSUFBSSxRQUFRLENBQUMsVUFBVSxHQUFHLDRCQUFnQixFQUFFO1lBQ3JGLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQztpQkFDakQscUJBQXFCLENBQ3JCLDBDQUEwQztnQkFDekMsS0FBSztnQkFDTCw2QkFBNkI7Z0JBQzdCLDRCQUFnQjtnQkFDaEIsT0FBTztnQkFDUCw0QkFBZ0IsQ0FDakI7aUJBQ0EsS0FBSyxFQUFFLENBQUM7U0FDVjtRQUNELEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvQyxNQUFNLElBQUksQ0FBQyxDQUFDO1FBRVosSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDckIsUUFBUSxDQUFDLE1BQU0sR0FBRywrQkFBbUIsQ0FBQztTQUN0QztRQUVELElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRywrQkFBbUIsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLCtCQUFtQixFQUFFO1lBQ25GLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQztpQkFDakQscUJBQXFCLENBQ3JCLHNDQUFzQztnQkFDckMsS0FBSztnQkFDTCw2QkFBNkI7Z0JBQzdCLDRCQUFnQjtnQkFDaEIsT0FBTztnQkFDUCw0QkFBZ0IsQ0FDakI7aUJBQ0EsS0FBSyxFQUFFLENBQUM7U0FDVjtRQUNELEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBQ2IsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFFWSxRQUFBLGNBQWMsR0FBc0I7SUFDaEQsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUscUJBQXFCO0lBQzNCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsS0FBSztJQUNiLFFBQVE7SUFDUixRQUFRO0NBQ1IsQ0FBQyJ9
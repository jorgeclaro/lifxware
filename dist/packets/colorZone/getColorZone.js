"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorZone = void 0;
const colorZone_1 = require("./colorZone");
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
const SIZE = 2;
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.startIndex < colorZone_1.ZONE_INDEX_MINIMUM_VALUE || obj.startIndex > colorZone_1.ZONE_INDEX_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid startIndex value given for getColorZones LIFX packet, must be a number between ' +
            colorZone_1.ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            colorZone_1.ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.startIndex, offset);
    offset += 1;
    if (obj.endIndex < colorZone_1.ZONE_INDEX_MINIMUM_VALUE || obj.endIndex > colorZone_1.ZONE_INDEX_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid endIndex value given for getColorZones LIFX packet, must be a number between ' +
            colorZone_1.ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            colorZone_1.ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.endIndex, offset);
    offset += 1;
    return buf;
}
exports.getColorZone = {
    type: 502,
    name: 'getColorZone',
    legacy: false,
    size: SIZE,
    tagged: false,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q29sb3Jab25lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvY29sb3Jab25lL2dldENvbG9yWm9uZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBb0c7QUFFcEcsMkNBQXNEO0FBQ3RELDBEQUFnRTtBQUVoRSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7QUFFZixTQUFTLFFBQVEsQ0FBQyxHQUFzQjtJQUN2QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRS9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsb0NBQXdCLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxvQ0FBd0IsRUFBRTtRQUMzRixNQUFNLElBQUksMkJBQW1CLENBQUMsa0NBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLHlGQUF5RjtZQUN4RixvQ0FBd0I7WUFDeEIsT0FBTztZQUNQLG9DQUF3QixDQUN6QjthQUNBLEtBQUssRUFBRSxDQUFDO0tBQ1Y7SUFDRCxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLElBQUksR0FBRyxDQUFDLFFBQVEsR0FBRyxvQ0FBd0IsSUFBSSxHQUFHLENBQUMsUUFBUSxHQUFHLG9DQUF3QixFQUFFO1FBQ3ZGLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQzthQUNqRCxxQkFBcUIsQ0FDckIsdUZBQXVGO1lBQ3RGLG9DQUF3QjtZQUN4QixPQUFPO1lBQ1Asb0NBQXdCLENBQ3pCO2FBQ0EsS0FBSyxFQUFFLENBQUM7S0FDVjtJQUVELEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosT0FBTyxHQUFHLENBQUM7QUFDWixDQUFDO0FBRVksUUFBQSxZQUFZLEdBQXNCO0lBQzlDLElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLGNBQWM7SUFDcEIsTUFBTSxFQUFFLEtBQUs7SUFDYixJQUFJLEVBQUUsSUFBSTtJQUNWLE1BQU0sRUFBRSxLQUFLO0lBQ2IsUUFBUTtDQUNSLENBQUMifQ==
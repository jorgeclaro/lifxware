import { HSBK_MINIMUM_RAW, HSBK_MAXIMUM_RAW } from '../color/colorHSBK';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 2;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
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
    if (obj.brightness < HSBK_MINIMUM_RAW && obj.brightness > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
    buf.writeUInt16LE(obj.brightness, offset);
    offset += 2;
    return buf;
}
export const setInfrared = {
    type: 122,
    name: 'setInfrared',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0SW5mcmFyZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy9pbmZyYXJlZC9zZXRJbmZyYXJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN4RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVuRSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7QUFFZixTQUFTLFFBQVEsQ0FBQyxHQUFXO0lBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUN6QixNQUFNLElBQUksbUJBQW1CLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvRCxDQUFDO0lBRUQsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU1QyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBRVosTUFBTSxHQUFHLEdBQWtCO1FBQzFCLFVBQVU7S0FDVixDQUFDO0lBRUYsT0FBTyxHQUFHLENBQUM7QUFDWixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsR0FBeUI7SUFDMUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUvQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1osSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLGdCQUFnQixJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztRQUM1RSxNQUFNLElBQUksbUJBQW1CLENBQUMsb0JBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLGtEQUFrRCxHQUFHLGdCQUFnQixHQUFHLE9BQU8sR0FBRyxnQkFBZ0IsQ0FDbEc7YUFDQSxLQUFLLEVBQUUsQ0FBQztJQUNYLENBQUM7SUFDRCxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBc0I7SUFDN0MsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsYUFBYTtJQUNuQixNQUFNLEVBQUUsS0FBSztJQUNiLElBQUksRUFBRSxJQUFJO0lBQ1YsTUFBTSxFQUFFLEtBQUs7SUFDYixRQUFRO0lBQ1IsUUFBUTtDQUNSLENBQUMifQ==
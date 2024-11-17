import { round } from '../../lib/utils';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
export const IR_MINIMUM_RAW = 0;
export const IR_MAXIMUM_RAW = 65535;
export const IR_MINIMUM_BRIGHTNESS = 0;
export const IR_MAXIMUM_BRIGHTNESS = 100;
/**
 * Checks validity of IR brightness
 * @param brightness IR brightness to validate
 */
export function validateNormalisedColorInfrared(brightness) {
    if (brightness < IR_MINIMUM_BRIGHTNESS || brightness > IR_MAXIMUM_BRIGHTNESS) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' +
            IR_MINIMUM_BRIGHTNESS +
            ' and ' +
            IR_MAXIMUM_BRIGHTNESS)
            .build();
    }
}
/**
 * Converts an object with hue,saturation,brightness,kelvin integer packet values to an
 * hsbk normalised integer object
 * @param {Object} packetColor object with hue,saturation,brightness,kelvin keys and values
 * @return {Object} hsvkColor object with hue,saturation,brightness,kelvin keys and converted values
 */
export function packetToNormalisedInfrared(packetColor) {
    const brightness = round((packetColor.brightness / IR_MAXIMUM_RAW) * IR_MAXIMUM_BRIGHTNESS, 2);
    return {
        brightness
    };
}
/**
 * Converts an object with hue,saturation,brightness,kelvin integer normalised values to an
 * hsbk packet integer object
 * @param irColor object with hue,saturation,brightness,kelvin keys and values
 * @return packetColor object with hue,saturation,brightness,kelvin keys and converted values
 */
export function normalisedToPacketInfraed(irColor) {
    const brightness = round((irColor.brightness / IR_MAXIMUM_BRIGHTNESS) * IR_MAXIMUM_RAW, 0);
    return {
        brightness
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JJbmZyYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWNrZXRzL2luZnJhcmVkL2NvbG9ySW5mcmFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRWhFLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFDaEMsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQztBQUVwQyxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFDdkMsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDO0FBVXpDOzs7R0FHRztBQUNILE1BQU0sVUFBVSwrQkFBK0IsQ0FBQyxVQUFrQjtJQUNqRSxJQUFJLFVBQVUsR0FBRyxxQkFBcUIsSUFBSSxVQUFVLEdBQUcscUJBQXFCLEVBQUUsQ0FBQztRQUM5RSxNQUFNLElBQUksbUJBQW1CLENBQUMsb0JBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLGtEQUFrRDtZQUNqRCxxQkFBcUI7WUFDckIsT0FBTztZQUNQLHFCQUFxQixDQUN0QjthQUNBLEtBQUssRUFBRSxDQUFDO0lBQ1gsQ0FBQztBQUNGLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxXQUEwQjtJQUNwRSxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxHQUFHLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRS9GLE9BQU87UUFDTixVQUFVO0tBQ1YsQ0FBQztBQUNILENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSx5QkFBeUIsQ0FBQyxPQUFzQjtJQUMvRCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLHFCQUFxQixDQUFDLEdBQUcsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTNGLE9BQU87UUFDTixVQUFVO0tBQ1YsQ0FBQztBQUNILENBQUMifQ==
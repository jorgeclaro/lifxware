import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
import { HSBK_MAXIMUM_RAW, HSBK_MINIMUM_RAW } from '../color/colorHSBK';
export const RGB_MAXIMUM_VALUE = 255;
export const RGB_MINIMUM_VALUE = 0;
/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 */
export function validateNormalisedColorRgb(red, green, blue) {
    if (red < RGB_MINIMUM_VALUE || red > RGB_MAXIMUM_VALUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects first parameter red to be between ' + RGB_MINIMUM_VALUE + ' and ' + RGB_MAXIMUM_VALUE)
            .build();
    }
    if (green < RGB_MINIMUM_VALUE || green > RGB_MAXIMUM_VALUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects second parameter green to be between ' + RGB_MINIMUM_VALUE + ' and ' + RGB_MAXIMUM_VALUE)
            .build();
    }
    if (blue < RGB_MINIMUM_VALUE || blue > RGB_MAXIMUM_VALUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects third parameter blue to be between ' + RGB_MINIMUM_VALUE + ' and ' + RGB_MAXIMUM_VALUE)
            .build();
    }
}
/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 */
export function validateRawColorRgb(red, green, blue) {
    if (red < HSBK_MINIMUM_RAW || red > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects first parameter red to be between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
    if (green < HSBK_MINIMUM_RAW || green > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects second parameter green to be between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
    if (blue < HSBK_MINIMUM_RAW || blue > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects third parameter blue to be between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
}
/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 * @param white White value to validate
 */
export function validateRawColorRgbw(red, green, blue, white) {
    validateNormalisedColorRgb(red, green, blue);
    if (blue < HSBK_MINIMUM_RAW || blue > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects fourth parameter white to be between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JSR0JXLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvY29sb3JSR0JXL2NvbG9yUkdCVy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUV4RSxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUM7QUFDckMsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0FBZ0JuQzs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxHQUFXLEVBQUUsS0FBYSxFQUFFLElBQVk7SUFDbEYsSUFBSSxHQUFHLEdBQUcsaUJBQWlCLElBQUksR0FBRyxHQUFHLGlCQUFpQixFQUFFLENBQUM7UUFDeEQsTUFBTSxJQUFJLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUNyQixrREFBa0QsR0FBRyxpQkFBaUIsR0FBRyxPQUFPLEdBQUcsaUJBQWlCLENBQ3BHO2FBQ0EsS0FBSyxFQUFFLENBQUM7SUFDWCxDQUFDO0lBRUQsSUFBSSxLQUFLLEdBQUcsaUJBQWlCLElBQUksS0FBSyxHQUFHLGlCQUFpQixFQUFFLENBQUM7UUFDNUQsTUFBTSxJQUFJLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUNyQixxREFBcUQsR0FBRyxpQkFBaUIsR0FBRyxPQUFPLEdBQUcsaUJBQWlCLENBQ3ZHO2FBQ0EsS0FBSyxFQUFFLENBQUM7SUFDWCxDQUFDO0lBRUQsSUFBSSxJQUFJLEdBQUcsaUJBQWlCLElBQUksSUFBSSxHQUFHLGlCQUFpQixFQUFFLENBQUM7UUFDMUQsTUFBTSxJQUFJLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUNyQixtREFBbUQsR0FBRyxpQkFBaUIsR0FBRyxPQUFPLEdBQUcsaUJBQWlCLENBQ3JHO2FBQ0EsS0FBSyxFQUFFLENBQUM7SUFDWCxDQUFDO0FBQ0YsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQixDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsSUFBWTtJQUMzRSxJQUFJLEdBQUcsR0FBRyxnQkFBZ0IsSUFBSSxHQUFHLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztRQUN0RCxNQUFNLElBQUksbUJBQW1CLENBQUMsb0JBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLGtEQUFrRCxHQUFHLGdCQUFnQixHQUFHLE9BQU8sR0FBRyxnQkFBZ0IsQ0FDbEc7YUFDQSxLQUFLLEVBQUUsQ0FBQztJQUNYLENBQUM7SUFFRCxJQUFJLEtBQUssR0FBRyxnQkFBZ0IsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztRQUMxRCxNQUFNLElBQUksbUJBQW1CLENBQUMsb0JBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLHFEQUFxRCxHQUFHLGdCQUFnQixHQUFHLE9BQU8sR0FBRyxnQkFBZ0IsQ0FDckc7YUFDQSxLQUFLLEVBQUUsQ0FBQztJQUNYLENBQUM7SUFFRCxJQUFJLElBQUksR0FBRyxnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4RCxNQUFNLElBQUksbUJBQW1CLENBQUMsb0JBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLG1EQUFtRCxHQUFHLGdCQUFnQixHQUFHLE9BQU8sR0FBRyxnQkFBZ0IsQ0FDbkc7YUFDQSxLQUFLLEVBQUUsQ0FBQztJQUNYLENBQUM7QUFDRixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLG9CQUFvQixDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsSUFBWSxFQUFFLEtBQWE7SUFDM0YsMEJBQTBCLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU3QyxJQUFJLElBQUksR0FBRyxnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4RCxNQUFNLElBQUksbUJBQW1CLENBQUMsb0JBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLHFEQUFxRCxHQUFHLGdCQUFnQixHQUFHLE9BQU8sR0FBRyxnQkFBZ0IsQ0FDckc7YUFDQSxLQUFLLEVBQUUsQ0FBQztJQUNYLENBQUM7QUFDRixDQUFDIn0=
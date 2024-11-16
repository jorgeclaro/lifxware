"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRawColorRgbw = exports.validateRawColorRgb = exports.validateNormalisedColorRgb = exports.RGB_MINIMUM_VALUE = exports.RGB_MAXIMUM_VALUE = void 0;
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
const colorHSBK_1 = require("../color/colorHSBK");
exports.RGB_MAXIMUM_VALUE = 255;
exports.RGB_MINIMUM_VALUE = 0;
/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 */
function validateNormalisedColorRgb(red, green, blue) {
    if (red < exports.RGB_MINIMUM_VALUE || red > exports.RGB_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects first parameter red to be between ' + exports.RGB_MINIMUM_VALUE + ' and ' + exports.RGB_MAXIMUM_VALUE)
            .build();
    }
    if (green < exports.RGB_MINIMUM_VALUE || green > exports.RGB_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects second parameter green to be between ' + exports.RGB_MINIMUM_VALUE + ' and ' + exports.RGB_MAXIMUM_VALUE)
            .build();
    }
    if (blue < exports.RGB_MINIMUM_VALUE || blue > exports.RGB_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects third parameter blue to be between ' + exports.RGB_MINIMUM_VALUE + ' and ' + exports.RGB_MAXIMUM_VALUE)
            .build();
    }
}
exports.validateNormalisedColorRgb = validateNormalisedColorRgb;
/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 */
function validateRawColorRgb(red, green, blue) {
    if (red < colorHSBK_1.HSBK_MINIMUM_RAW || red > colorHSBK_1.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects first parameter red to be between ' + colorHSBK_1.HSBK_MINIMUM_RAW + ' and ' + colorHSBK_1.HSBK_MAXIMUM_RAW)
            .build();
    }
    if (green < colorHSBK_1.HSBK_MINIMUM_RAW || green > colorHSBK_1.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects second parameter green to be between ' + colorHSBK_1.HSBK_MINIMUM_RAW + ' and ' + colorHSBK_1.HSBK_MAXIMUM_RAW)
            .build();
    }
    if (blue < colorHSBK_1.HSBK_MINIMUM_RAW || blue > colorHSBK_1.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects third parameter blue to be between ' + colorHSBK_1.HSBK_MINIMUM_RAW + ' and ' + colorHSBK_1.HSBK_MAXIMUM_RAW)
            .build();
    }
}
exports.validateRawColorRgb = validateRawColorRgb;
/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 * @param white White value to validate
 */
function validateRawColorRgbw(red, green, blue, white) {
    validateNormalisedColorRgb(red, green, blue);
    if (blue < colorHSBK_1.HSBK_MINIMUM_RAW || blue > colorHSBK_1.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects fourth parameter white to be between ' + colorHSBK_1.HSBK_MINIMUM_RAW + ' and ' + colorHSBK_1.HSBK_MAXIMUM_RAW)
            .build();
    }
}
exports.validateRawColorRgbw = validateRawColorRgbw;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JSR0JXLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvY29sb3JSR0JXL2NvbG9yUkdCVy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBc0Q7QUFDdEQsMERBQWdFO0FBQ2hFLGtEQUF3RTtBQUUzRCxRQUFBLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUN4QixRQUFBLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQWdCbkM7Ozs7O0dBS0c7QUFDSCxTQUFnQiwwQkFBMEIsQ0FBQyxHQUFXLEVBQUUsS0FBYSxFQUFFLElBQVk7SUFDbEYsSUFBSSxHQUFHLEdBQUcseUJBQWlCLElBQUksR0FBRyxHQUFHLHlCQUFpQixFQUFFO1FBQ3ZELE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQzthQUNqRCxxQkFBcUIsQ0FDckIsa0RBQWtELEdBQUcseUJBQWlCLEdBQUcsT0FBTyxHQUFHLHlCQUFpQixDQUNwRzthQUNBLEtBQUssRUFBRSxDQUFDO0tBQ1Y7SUFFRCxJQUFJLEtBQUssR0FBRyx5QkFBaUIsSUFBSSxLQUFLLEdBQUcseUJBQWlCLEVBQUU7UUFDM0QsTUFBTSxJQUFJLDJCQUFtQixDQUFDLGtDQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUNyQixxREFBcUQsR0FBRyx5QkFBaUIsR0FBRyxPQUFPLEdBQUcseUJBQWlCLENBQ3ZHO2FBQ0EsS0FBSyxFQUFFLENBQUM7S0FDVjtJQUVELElBQUksSUFBSSxHQUFHLHlCQUFpQixJQUFJLElBQUksR0FBRyx5QkFBaUIsRUFBRTtRQUN6RCxNQUFNLElBQUksMkJBQW1CLENBQUMsa0NBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLG1EQUFtRCxHQUFHLHlCQUFpQixHQUFHLE9BQU8sR0FBRyx5QkFBaUIsQ0FDckc7YUFDQSxLQUFLLEVBQUUsQ0FBQztLQUNWO0FBQ0YsQ0FBQztBQXhCRCxnRUF3QkM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsSUFBWTtJQUMzRSxJQUFJLEdBQUcsR0FBRyw0QkFBZ0IsSUFBSSxHQUFHLEdBQUcsNEJBQWdCLEVBQUU7UUFDckQsTUFBTSxJQUFJLDJCQUFtQixDQUFDLGtDQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUNyQixrREFBa0QsR0FBRyw0QkFBZ0IsR0FBRyxPQUFPLEdBQUcsNEJBQWdCLENBQ2xHO2FBQ0EsS0FBSyxFQUFFLENBQUM7S0FDVjtJQUVELElBQUksS0FBSyxHQUFHLDRCQUFnQixJQUFJLEtBQUssR0FBRyw0QkFBZ0IsRUFBRTtRQUN6RCxNQUFNLElBQUksMkJBQW1CLENBQUMsa0NBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLHFEQUFxRCxHQUFHLDRCQUFnQixHQUFHLE9BQU8sR0FBRyw0QkFBZ0IsQ0FDckc7YUFDQSxLQUFLLEVBQUUsQ0FBQztLQUNWO0lBRUQsSUFBSSxJQUFJLEdBQUcsNEJBQWdCLElBQUksSUFBSSxHQUFHLDRCQUFnQixFQUFFO1FBQ3ZELE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQzthQUNqRCxxQkFBcUIsQ0FDckIsbURBQW1ELEdBQUcsNEJBQWdCLEdBQUcsT0FBTyxHQUFHLDRCQUFnQixDQUNuRzthQUNBLEtBQUssRUFBRSxDQUFDO0tBQ1Y7QUFDRixDQUFDO0FBeEJELGtEQXdCQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLG9CQUFvQixDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsSUFBWSxFQUFFLEtBQWE7SUFDM0YsMEJBQTBCLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU3QyxJQUFJLElBQUksR0FBRyw0QkFBZ0IsSUFBSSxJQUFJLEdBQUcsNEJBQWdCLEVBQUU7UUFDdkQsTUFBTSxJQUFJLDJCQUFtQixDQUFDLGtDQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUNyQixxREFBcUQsR0FBRyw0QkFBZ0IsR0FBRyxPQUFPLEdBQUcsNEJBQWdCLENBQ3JHO2FBQ0EsS0FBSyxFQUFFLENBQUM7S0FDVjtBQUNGLENBQUM7QUFWRCxvREFVQyJ9
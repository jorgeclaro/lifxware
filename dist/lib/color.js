"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbToHsb = exports.rgbHexStringToObject = void 0;
const colorRGBW_1 = require("../packets/colorRGBW/colorRGBW");
const error_1 = require("./error");
const lightErrors_1 = require("../errors/lightErrors");
/**
 * Converts an RGB Hex string to an object with decimal representations
 * @example rgbHexStringToObject('#FF00FF')
 * @param rgbHexString hex value to parse, with leading #
 * @return object with decimal values for red, green and blue
 */
function rgbHexStringToObject(rgbHexString) {
    const hashChar = rgbHexString.substr(0, 1);
    if (hashChar !== '#') {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage(`rgbHexStringToObject expects hex parameter with leading '#' sign`)
            .build();
    }
    const pureHex = rgbHexString.substr(1);
    if (pureHex.length !== 6 && pureHex.length !== 3) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage(`rgbHexStringToObject expects hex value parameter to be 3 or 6 chars long`)
            .build();
    }
    let red;
    let green;
    let blue;
    if (pureHex.length === 6) {
        red = pureHex.substring(0, 2);
        green = pureHex.substring(2, 4);
        blue = pureHex.substring(4, 6);
    }
    else if (pureHex.length === 3) {
        red = pureHex.substring(0, 1);
        red += red;
        green = pureHex.substring(1, 2);
        green += green;
        blue = pureHex.substring(2, 3);
        blue += blue;
    }
    const rgb = {
        red: parseInt(red, 16),
        green: parseInt(green, 16),
        blue: parseInt(blue, 16)
    };
    return rgb;
}
exports.rgbHexStringToObject = rgbHexStringToObject;
/**
 * Converts an object with r,g,b integer values to an
 * hsb integer object
 * @param rgbObj object with red, green and blue  keys and values
 * @return object with huse, saturation and brightness keys and converted values
 */
function rgbToHsb(rgbObj) {
    const red = rgbObj.red / colorRGBW_1.RGB_MAXIMUM_VALUE;
    const green = rgbObj.green / colorRGBW_1.RGB_MAXIMUM_VALUE;
    const blue = rgbObj.blue / colorRGBW_1.RGB_MAXIMUM_VALUE;
    const rgb = [red, green, blue];
    const sortedCopy = rgb.slice();
    sortedCopy.sort((a, b) => {
        return a - b;
    });
    const max = sortedCopy[sortedCopy.length - 1];
    sortedCopy.sort((a, b) => {
        return a - b;
    });
    const min = sortedCopy[0];
    const c = max - min;
    /** https://en.wikipedia.org/wiki/HSL_and_HSV#Hue_and_chroma */
    let hue;
    if (c === 0) {
        hue = 0;
    }
    else if (max === red) {
        hue = (green - blue) / c;
        if (hue < 0) {
            hue += 6;
        }
    }
    else if (max === green) {
        hue = 2 + (blue - red) / c;
    }
    else {
        /** max === blue */
        hue = 4 + (red - green) / c;
    }
    /** https://en.wikipedia.org/wiki/HSL_and_HSV#Lightness */
    const lightness = max;
    /** https://en.wikipedia.org/wiki/HSL_and_HSV#Saturation */
    let saturation;
    if (c === 0) {
        saturation = 0;
    }
    else {
        saturation = c / lightness;
    }
    const hsb = {
        hue: Math.round(60 * hue),
        saturation: Math.round(saturation * 100),
        brightness: Math.round(lightness * 100)
    };
    return hsb;
}
exports.rgbToHsb = rgbToHsb;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDhEQUE2RTtBQUM3RSxtQ0FBOEM7QUFDOUMsdURBQTZEO0FBRTdEOzs7OztHQUtHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsWUFBb0I7SUFDeEQsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFM0MsSUFBSSxRQUFRLEtBQUssR0FBRyxFQUFFO1FBQ3JCLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQzthQUNqRCxxQkFBcUIsQ0FBQyxrRUFBa0UsQ0FBQzthQUN6RixLQUFLLEVBQUUsQ0FBQztLQUNWO0lBQ0QsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ2pELE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQzthQUNqRCxxQkFBcUIsQ0FBQywwRUFBMEUsQ0FBQzthQUNqRyxLQUFLLEVBQUUsQ0FBQztLQUNWO0lBRUQsSUFBSSxHQUFHLENBQUM7SUFDUixJQUFJLEtBQUssQ0FBQztJQUNWLElBQUksSUFBSSxDQUFDO0lBRVQsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN6QixHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMvQjtTQUFN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
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
import { HSBK_MAXIMUM_RAW, HSBK_MINIMUM_RAW } from '../color/colorHSBK';

export const RGB_MAXIMUM_VALUE = 255;
export const RGB_MINIMUM_VALUE = 0;

export interface ColorRGB {
	red: number;
	green: number;
	blue: number;
}

export interface ColorRGBW extends ColorRGB {
	white: number;
}

export interface ColorRGBWRequest {
	color: ColorRGBW;
}

/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 */
export function validateNormalisedColorRgb(red: number, green: number, blue: number) {
	if (red < RGB_MINIMUM_VALUE || red > RGB_MAXIMUM_VALUE) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects first parameter red to be between ' + RGB_MINIMUM_VALUE + ' and ' + RGB_MAXIMUM_VALUE
			)
			.build();
	}

	if (green < RGB_MINIMUM_VALUE || green > RGB_MAXIMUM_VALUE) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects second parameter green to be between ' + RGB_MINIMUM_VALUE + ' and ' + RGB_MAXIMUM_VALUE
			)
			.build();
	}

	if (blue < RGB_MINIMUM_VALUE || blue > RGB_MAXIMUM_VALUE) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects third parameter blue to be between ' + RGB_MINIMUM_VALUE + ' and ' + RGB_MAXIMUM_VALUE
			)
			.build();
	}
}

/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 */
export function validateRawColorRgb(red: number, green: number, blue: number) {
	if (red < HSBK_MINIMUM_RAW || red > HSBK_MAXIMUM_RAW) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects first parameter red to be between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW
			)
			.build();
	}

	if (green < HSBK_MINIMUM_RAW || green > HSBK_MAXIMUM_RAW) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects second parameter green to be between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW
			)
			.build();
	}

	if (blue < HSBK_MINIMUM_RAW || blue > HSBK_MAXIMUM_RAW) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects third parameter blue to be between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW
			)
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
export function validateRawColorRgbw(red: number, green: number, blue: number, white: number) {
	validateNormalisedColorRgb(red, green, blue);

	if (blue < HSBK_MINIMUM_RAW || blue > HSBK_MAXIMUM_RAW) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects fourth parameter white to be between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW
			)
			.build();
	}
}

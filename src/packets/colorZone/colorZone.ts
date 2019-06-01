import { ColorHSBK } from '../color/colorHSBK';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';

export const ZONE_INDEX_MINIMUM_VALUE = 0;
export const ZONE_INDEX_MAXIMUM_VALUE = 255;

/**
 * This type allows you to provide hints to the device about how the changes you make should be performed.
 * For example you can send multiple zones and have them all apply at once.
 * Application Request is stored as an unsigned 8-bit integer.
 */
export enum ApplyRequest {
	/** Don't apply the requested changes until a message with APPLY or APPLY_ONLY is sent */
	NO_APPLY = 0,

	/** Apply the changes immediately and apply any pending changes */
	APPLY = 1,

	/** Ignore the requested changes in this message and only apply pending changes */
	APPLY_ONLY = 2
}

export interface ColorZonesRequest {
	startIndex: number;
	endIndex: number;
	color?: ColorHSBK;
	apply?: ApplyRequest;
	duration?: number;
}

export interface ColorZone {
	count: number; //zone count, between 0 and 255
	index: number; //index of first zone, between 0 and 255
	color: ColorHSBK;
}

export interface MultiZone {
	count: number; //zone count, between 0 and 255
	index: number; //index of first zone, between 0 and 255
	color: ColorHSBK[]; //an array with 1 to 8 HSBK color objects
}

/**
 * Checks validity of a light zone index
 * @param index Light zone index to validate
 */
export function validateColorZoneIndex(index: number) {
	if (index < ZONE_INDEX_MINIMUM_VALUE || index > ZONE_INDEX_MAXIMUM_VALUE) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects zone to be a number between ' +
					ZONE_INDEX_MINIMUM_VALUE +
					' and ' +
					ZONE_INDEX_MAXIMUM_VALUE
			)
			.build();
	}
}

/**
 * Checks validity of an optional light zone index
 * @param index Light zone index to validate
 */
export function validateColorZoneIndexOptional(index: number) {
	if (index) {
		if (index < ZONE_INDEX_MINIMUM_VALUE || index > ZONE_INDEX_MAXIMUM_VALUE) {
			throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
				.withContextualMessage(
					'Light expects zone to be a number between ' +
						ZONE_INDEX_MINIMUM_VALUE +
						' and ' +
						ZONE_INDEX_MAXIMUM_VALUE
				)
				.build();
		}
	}
}

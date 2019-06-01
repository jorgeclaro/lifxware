import { ColorHSBK } from '../color/colorHSBK';

/**
 * Definition of waveform types
 *
 * Allow us to combine functions such as fading, pulsing, etc
 * by applying waveform interpolation on the modulation between two colors.
 */
export enum WaveformType {
	SAW = 0,
	SINE = 1,
	HALF_SINE = 3,
	TRIANGLE = 4,
	PULSE = 5
}

/**
 * Definition of a waveform request
 */
export interface WaveformRequest {
	/**
	 * Reserved
	 * @type unsigned 8-bit integer
	 */

	/**
	 * Color does not persist
	 * @type 8-bit integer as 0 or 1
	 */
	isTransient: boolean;

	/**
	 * Light end color
	 * @type HsbColor
	 */
	color: ColorHSBK;

	/**
	 * Duration of a cycle in milliseconds
	 * @type unsigned 32-bit integer
	 */
	period: number;

	/**
	 * Number of cycles
	 * @type 32-bit float
	 */
	cycles: number;

	/**
	 * Waveform Skew, [-32768, 32767] scaled to [0, 1]
	 *
	 * Distribution between time on original and new color,
	 * positive is for more new color,
	 * negative for original color
	 *
	 * @type signed 16-bit integer
	 */
	skewRatio: number;

	/**
	 * Waveform to use for transition
	 * @type unsigned 8-bit integer
	 */
	waveform: WaveformType;

	/** Set Hue
	 *
	 * Only used on SetWaveformOptional - 119
	 * Sets the current value on device.
	 * This message will be replied to with a State message.
	 *
	 * @type 8-bit integer as 0 or 1
	 */
	setHue?: boolean;

	/** Set Saturation
	 *
	 * Only used on SetWaveformOptional - 119
	 * Sets the current value on device.
	 * This message will be replied to with a State message.
	 *
	 * @type 8-bit integer as 0 or 1
	 */
	setSaturation?: boolean;

	/** Set Brightness
	 *
	 * Only used on SetWaveformOptional - 119
	 * Sets the current value on device.
	 * This message will be replied to with a State message.
	 *
	 * @type 8-bit integer as 0 or 1
	 */
	setBrightness?: boolean;

	/** Set Kelvin
	 *
	 * Only used on SetWaveformOptional - 119
	 * Sets the current value on device.
	 * This message will be replied to with a State message.
	 *
	 * @type 8-bit integer as 0 or 1
	 */
	setKelvin?: boolean;
}

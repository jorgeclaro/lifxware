/**
 * Definition of waveform types
 *
 * Allow us to combine functions such as fading, pulsing, etc
 * by applying waveform interpolation on the modulation between two colors.
 */
export var WaveformType;
(function (WaveformType) {
    WaveformType[WaveformType["SAW"] = 0] = "SAW";
    WaveformType[WaveformType["SINE"] = 1] = "SINE";
    WaveformType[WaveformType["HALF_SINE"] = 3] = "HALF_SINE";
    WaveformType[WaveformType["TRIANGLE"] = 4] = "TRIANGLE";
    WaveformType[WaveformType["PULSE"] = 5] = "PULSE";
})(WaveformType || (WaveformType = {}));
//# sourceMappingURL=waveform.js.map
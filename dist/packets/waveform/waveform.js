"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaveformType = void 0;
/**
 * Definition of waveform types
 *
 * Allow us to combine functions such as fading, pulsing, etc
 * by applying waveform interpolation on the modulation between two colors.
 */
var WaveformType;
(function (WaveformType) {
    WaveformType[WaveformType["SAW"] = 0] = "SAW";
    WaveformType[WaveformType["SINE"] = 1] = "SINE";
    WaveformType[WaveformType["HALF_SINE"] = 3] = "HALF_SINE";
    WaveformType[WaveformType["TRIANGLE"] = 4] = "TRIANGLE";
    WaveformType[WaveformType["PULSE"] = 5] = "PULSE";
})(WaveformType = exports.WaveformType || (exports.WaveformType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F2ZWZvcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFja2V0cy93YXZlZm9ybS93YXZlZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQTs7Ozs7R0FLRztBQUNILElBQVksWUFNWDtBQU5ELFdBQVksWUFBWTtJQUN2Qiw2Q0FBTyxDQUFBO0lBQ1AsK0NBQVEsQ0FBQTtJQUNSLHlEQUFhLENBQUE7SUFDYix1REFBWSxDQUFBO0lBQ1osaURBQVMsQ0FBQTtBQUNWLENBQUMsRUFOVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQU12QiJ9
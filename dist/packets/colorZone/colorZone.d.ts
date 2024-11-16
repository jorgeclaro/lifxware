import { ColorHSBK } from '../color/colorHSBK';
export declare const ZONE_INDEX_MINIMUM_VALUE = 0;
export declare const ZONE_INDEX_MAXIMUM_VALUE = 255;
/**
 * This type allows you to provide hints to the device about how the changes you make should be performed.
 * For example you can send multiple zones and have them all apply at once.
 * Application Request is stored as an unsigned 8-bit integer.
 */
export declare enum ApplyRequest {
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
    count: number;
    index: number;
    color: ColorHSBK;
}
export interface MultiZone {
    count: number;
    index: number;
    color: ColorHSBK[];
}
/**
 * Checks validity of a light zone index
 * @param index Light zone index to validate
 */
export declare function validateColorZoneIndex(index: number): void;
/**
 * Checks validity of an optional light zone index
 * @param index Light zone index to validate
 */
export declare function validateColorZoneIndexOptional(index: number): void;
//# sourceMappingURL=colorZone.d.ts.map
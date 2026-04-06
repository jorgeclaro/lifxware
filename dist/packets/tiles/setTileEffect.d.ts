import { ColorHSBK } from '../color/colorHSBK';
import { PacketBodyHandler } from '../../lib/packet';
export interface TileEffectSettings {
    instanceid: number;
    type: number;
    speed: number;
    duration: bigint;
    parameter: number[];
    paletteCount: number;
    palette: ColorHSBK[];
}
export declare const setTileEffect: PacketBodyHandler;
//# sourceMappingURL=setTileEffect.d.ts.map
import { ColorHSBK } from './packets/color/colorHSBK';
import { Tag } from './packets/tag/tag';
import { TagLabels } from './packets/tagLabel/tagLabel';
import { Label } from './packets/label/label';
import { WaveformRequest } from './packets/waveform/waveform';
import { Client } from './client';
import { SetTileState64Request, SetUserPositionRequest } from './packets/tiles/tiles';
import { Group } from './packets/group/group';
import EventEmitter from 'events';
export declare enum LightEvents {
    CONECTIVITY = "connectivity",
    LABEL = "label",
    COLOR = "color",
    STATE = "state",
    POWER = "power"
}
export interface LightOptions {
    client: Client;
    id: string;
    address: string;
    port: number;
    legacy: boolean;
    discoveryPacketNumber: number;
}
export declare class Light extends EventEmitter {
    id: string;
    address: string;
    port: number;
    legacy: boolean;
    label: string;
    private _discoveryPacketNumber;
    private _client;
    private _connectivity;
    private _group;
    private _power;
    private _color;
    get connectivity(): boolean;
    set connectivity(newConnectivity: boolean);
    get power(): boolean;
    set power(newPower: boolean);
    get color(): ColorHSBK;
    set color(newColor: ColorHSBK);
    get discoveryPacketNumber(): number;
    set discoveryPacketNumber(discoveryPacketNumber: number);
    constructor(params: LightOptions);
    setPower(power: boolean, duration?: number): Promise<unknown>;
    getColor(cache?: boolean, timeout?: number): Promise<unknown>;
    setColor(hue: number, saturation: number, brightness: number, kelvin: number, duration?: number, timeout?: number): Promise<unknown>;
    setColorRgb(red: number, green: number, blue: number, duration?: number, timeout?: number): Promise<unknown>;
    setColorRgbHex(hexString: string, duration?: number, timeout?: number): Promise<unknown>;
    getTime(timeout?: number): Promise<unknown>;
    setTime(time: any, timeout?: number): Promise<unknown>;
    getState(cache?: boolean, timeout?: number): Promise<unknown>;
    getResetSwitchState(timeout?: number): Promise<unknown>;
    getInfrared(timeout?: number): Promise<unknown>;
    setInfrared(brightness: number, timeout?: number): Promise<unknown>;
    getHostInfo(timeout?: number): Promise<unknown>;
    getHostFirmware(timeout?: number): Promise<unknown>;
    getHardwareVersion(timeout?: number): Promise<unknown>;
    getWifiInfo(timeout?: number): Promise<unknown>;
    getWifiFirmware(timeout?: number): Promise<unknown>;
    getLabel(cache?: boolean, timeout?: number): Promise<unknown>;
    setLabel(label: Label, timeout?: number): Promise<unknown>;
    getGroup(cache?: boolean, timeout?: number): Promise<Group>;
    getTags(timeout?: number): Promise<unknown>;
    setTags(tags: Tag, timeout?: number): Promise<unknown>;
    getTagLabels(tagLabels: TagLabels, timeout?: number): Promise<unknown>;
    setTagLabels(tagLabels: TagLabels, timeout?: number): Promise<unknown>;
    getAmbientLight(timeout?: number): Promise<unknown>;
    getPower(cache?: boolean, timeout?: number): Promise<unknown>;
    getColorZones(startIndex: number, endIndex: number): Promise<unknown>;
    setColorZones(startIndex: number, endIndex: number, hue: number, saturation: number, brightness: number, kelvin: number, duration: number, apply: boolean): Promise<unknown>;
    setWaveform(waveform: WaveformRequest): Promise<unknown>;
    getDeviceChain(timeout?: number): Promise<unknown>;
    getTileState64(timeout?: number): Promise<unknown>;
    setTileState64(setTileState64Request: SetTileState64Request, timeout?: number): Promise<unknown>;
    setUserPosition(setUserPositionRequest: SetUserPositionRequest): Promise<unknown>;
    getHevCycle(timeout?: number): Promise<unknown>;
    setHevCycle(hevCycle: {
        enable: boolean;
        durationS: number;
    }, timeout?: number): Promise<unknown>;
    getHevCycleConfig(timeout?: number): Promise<unknown>;
    setHevCycleConfig(config: {
        indication: boolean;
        durationS: number;
    }, timeout?: number): Promise<unknown>;
    getLastHevCycleResult(timeout?: number): Promise<unknown>;
    getMultiZoneEffect(timeout?: number): Promise<unknown>;
    setMultiZoneEffect(effect: {
        type: number;
        speed: number;
        duration: bigint;
    }, timeout?: number): Promise<unknown>;
    getExtendedColorZones(timeout?: number): Promise<unknown>;
    setExtendedColorZones(zones: {
        duration: number;
        apply: number;
        index: number;
        colors: ColorHSBK[];
    }, timeout?: number): Promise<unknown>;
    getTileEffect(timeout?: number): Promise<unknown>;
    setTileEffect(effect: {
        type: number;
        speed: number;
        duration: bigint;
        paletteCount: number;
        palette: ColorHSBK[];
    }, timeout?: number): Promise<unknown>;
    getRelayPower(relayIndex: number, timeout?: number): Promise<unknown>;
    setRelayPower(relayIndex: number, power: boolean, timeout?: number): Promise<unknown>;
}
//# sourceMappingURL=light.d.ts.map
import { EventEmitter } from 'eventemitter3';
import { ColorHSBK } from './packets/color/colorHSBK';
import { Tag } from './packets/tag/tag';
import { TagLabels } from './packets/tagLabel/tagLabel';
import { Label } from './packets/label/label';
import { WaveformRequest } from './packets/waveform/waveform';
import { Client } from './client';
import { SetTileState64Request, SetUserPositionRequest } from './packets/tiles/tiles';
import { Group } from './packets/group/group';
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
    private _discoveryPacketNumber;
    private _client;
    private _connectivity;
    private _label;
    private _group;
    private _power;
    private _color;
    get connectivity(): boolean;
    set connectivity(newConnectivity: boolean);
    get label(): string;
    set label(newLabel: string);
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
}
//# sourceMappingURL=light.d.ts.map
import { Light } from './light';
import { RInfo } from './lib/messagePack';
import { AddressInfo } from 'net';
import EventEmitter from "events";
export declare const MINIMUM_PORT_NUMBER = 1;
export declare const MAXIMUM_PORT_NUMBER = 65535;
export declare const DEFAULT_PROVISIONING_DELAY = 5000;
export declare const DEFAULT_PORT = 56700;
export declare const DEFAULT_BROADCAST_PORT = 56800;
export declare const DEFAULT_MSG_RATE_LIMIT = 100;
export declare const DEFAULT_MSG_DISCOVERY_INTERVAL = 5000;
export declare const DEFAULT_MSG_REPLY_TIMEOUT = 5000;
type Devices = {
    [id: string]: Light;
};
export declare enum ClientEvents {
    ERROR = "error",
    MESSAGE = "message",
    LISTENING = "listening",
    LIGHT_NEW = "light-new",
    LIGHT_CONNECTIVITY = "light-connectivity"
}
export interface ClientOptions {
    address?: string;
    port?: number;
    debug?: boolean;
    lightOfflineTolerance?: number;
    messageHandlerTimeout?: number;
    source?: string;
    startDiscovery?: boolean;
    lightAddresses?: string[];
    broadcast?: string;
    resendPacketDelay?: number;
    resendMaxTimes?: number;
}
export declare class Client extends EventEmitter {
    /** Client identifier */
    source: string;
    /** List of devices discovered by client */
    devices: Devices;
    /** Client debug flag */
    debug: boolean;
    /** Client dgram socket instance */
    private _socket;
    /** Client dgram socket port number */
    private _port;
    /** Client sgram docket */
    private _isSocketBound;
    /** List of messages to be sent queued on client */
    private _messagePackQueue;
    /** Timer to handle rate limit of messages that will be sent */
    private _sendTimer;
    /** Timer to handle the discovery packet broadcast interval */
    private _discoveryTimer;
    /** Reference number to the last discovery paccket sent */
    private _discoveryPacketSequence;
    /** Reference number to the last message sent */
    private _sequenceNumber;
    /** Light offline tolerance in msg count */
    private _lightOfflineTolerance;
    /** Message handler timeout in milliseconds */
    private _messagePackHandlerTimeout;
    /** Time interval to resend the same packet if it failed */
    private _resendPacketDelay;
    /** Maximum number of attepts to resend the same packet if it failed previously */
    private _resendMaxTimes;
    /** Client socket broadcast address */
    private _broadcastAddress;
    /** List of predefined message handlers */
    private _messagePackHandlers;
    constructor(params?: ClientOptions, callback?: Function);
    private validateClientOptions;
    destroy(): void;
    sendingProcess(): void;
    startSendingProcess(): void;
    stopSendingProcess(): void;
    private sendBroadcastDiscoveryPacket;
    startDiscovery(lightAddresses?: string[]): void;
    processMessagePackHandlers(msg: any, rinfo: RInfo): void;
    processDiscoveryPacket(err: Error, msg: any, rinfo: RInfo): Promise<void>;
    processLabelPacket(err: Error, msg: any, rinfo?: RInfo): void;
    processLightPacket(err: Error, msg: any, rinfo?: RInfo): void;
    processPowerPacket(err: Error, msg: any, rinfo?: RInfo): void;
    processPowerLegacyPacket(err: Error, msg: any, rinfo?: RInfo): void;
    stopDiscovery(): void;
    send(msg: any, callback?: Function): number;
    getAddress(): AddressInfo;
    addMessageHandler(name: string, callback: Function, sequenceNumber: number): void;
    lights(status?: boolean): Light[];
    light(identifier: string): Light;
}
export {};
//# sourceMappingURL=client.d.ts.map
/// <reference types="node" />
import { PACKET_TRANSACTION_TYPES } from './packet';
/** Definition of message pack handler */
export interface MessagePackHandler {
    name: string;
    callback: Function;
    createdAt: Date;
    sequenceNumber?: number;
}
/** Definition of message pack */
export interface MessagePack {
    targetAddress: string;
    transactionType: PACKET_TRANSACTION_TYPES;
    payload: Buffer;
    sequenceNumber: number;
    createdAt: Date;
    sendAttempts: number;
    lastSentAt: number;
}
/** Definition of message RInfo */
export interface RInfo {
    address: string;
    family: string;
    port: number;
    size: number;
}
//# sourceMappingURL=messagePack.d.ts.map
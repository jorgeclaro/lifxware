/** Masks for packet description in packet header */
export declare const ADDRESSABLE_BIT = 4096;
export declare const TAGGED_BIT = 8192;
export declare const ORIGIN_BITS = 49152;
export declare const PROTOCOL_VERSION_BITS = 4095;
/** Masks for response types in packet header */
export declare const RESPONSE_REQUIRED_BIT = 1;
export declare const ACK_REQUIRED_BIT = 2;
/** Protocol version mappings */
export declare const PROTOCOL_VERSION_CURRENT = 1024;
export declare const PROTOCOL_VERSION_LEGACY = 13312;
/** Packet headers */
export declare const PACKET_HEADER_SIZE = 36;
export declare const PACKET_HEADER_SEQUENCE_MAX = 255;
export declare const PACKET_DEFAULT_SORUCE = "00000000";
/**
 * Definition of packet header object
 */
export interface PacketHeader {
    /** Frame */
    /** Size of entire message in bytes including this field
     * @bitSize 16
     * @zeroIndexedLocation Lower octet: Byte 0. Upper octet: Byte 1.
     * @type uint16_t
     */
    size: number;
    /** Protocol number (1024)
     * @bitSize 12
     * @zeroIndexedLocation Lower octet: Byte 2. Upper 4 bits: Byte 3, Bits 0-3.
     * @type uint16_t
     */
    protocolVersion: number;
    /** Message includes a target address: must be one (1)
     * @bitSize 1
     * @zeroIndexedLocation Byte 3, Bit 4.
     * @type bool
     */
    addressable: boolean;
    /** Determines usage of the Frame Address target field
     * @bitSize 1
     * @zeroIndexedLocation Byte 3, Bit 5.
     * @type bool
     * @description The tagged field is a boolean flag that indicates whether
     * the Frame Address target field is being used to address an individual device or all devices.
     * For discovery using Device::GetService the tagged field should be set to one (1) and the target should be all zeroes.
     * In all other messages the tagged field should be set to zero (0) and the target field should contain the device MAC address.
     * The device will then respond with a Device::StateService message, which will include its own MAC address in the target field.
     * In all subsequent messages that the client sends to the device,
     * the target field should be set to the device MAC address, and the tagged field should be set to zero (0).
     */
    tagged: boolean;
    /** Message origin indicator: must be zero (0)
     * @bitSize 2
     * @zeroIndexedLocation Byte 3, Bits 6-7.
     * @type uint8_t
     */
    origin: boolean;
    /** Source identifier: unique value set by the client, used by responses
     * @bitSize 32
     * @zeroIndexedLocation Lowest octet: Byte 4. Highest octet: Byte 7.
     * @type uint32_t
     * @description The source identifier allows each client to provide an unique value,
     * which will be included by the LIFX device in any message that is sent in response to a message sent by the client.
     * If the source identifier is a non-zero value, then the LIFX device will send a unicast message to the IP address
     * and port of the client that sent the originating message. If the source identifier is a zero value,
     * then the LIFX device may send a broadcast message that can be received by all clients on the same sub-net.
     * See _ack_required_ and _res_required_ fields in the Frame Address.
     */
    source: string;
    /** Frame Address */
    /** 6 byte device address (MAC address) or zero (0) means all devices. The last two bytes should be 0 bytes
     * @bitSize 64
     * @zeroIndexedLocation Bytes 8 - 15.
     * @type uint8_t[8]
     * @description The target device address is 8 bytes long,
     * when using the 6 byte MAC address then left-justify the value and zero-fill the last two bytes.
     * A target device address of all zeroes effectively addresses all devices on the local network.
     * The Frame tagged field must be set accordingly.
     */
    target: string;
    /** legacy field used for targgeting the master bulb (MAC address) (reserved)
     * @bitSize 48
     * @zeroIndexedLocation Bytes 16 - 21.
     * @type uint8_t[6]
     */
    site?: string;
    /** Reserved - Must all be zero (0)
     * @bitSize 48
     * @zeroIndexedLocation Bytes 16 - 21.
     * @type uint8_t[6]
     */
    /** Response message required
     * @bitSize 1
     * @zeroIndexedLocation Byte 22, Bit 0.
     * @type bool
     * @description _ack_required_ set to one (1) will cause the device to send an Device::Acknowledgement message
     * The source identifier in the response message will be set to the same value as that in the requesting message sent by the client.
     * The client can use acknowledgments to determine that the LIFX device has received a message.
     * However, when using acknowledgments to ensure reliability in an over-burdened lossy network ...
     * causing additional network packets may make the problem worse.
     * Client that don't need to track the updated state of a LIFX device can choose not to request a response,
     * which will reduce the network burden and may provide some performance advantage.
     * In some cases, a device may choose to send a state update response independent of whether _res_required_ is set.
     */
    resRequired: boolean;
    /** Acknowledgement message required
     * @bitSize 1
     * @zeroIndexedLocation Byte 22, Bit 1.
     * @type bool
     * @description _res_required_ set to one (1) within a Set message,
     * e.g Light::SetPower will cause the device to send the corresponding State message, e.g Light::StatePower
     * The source identifier in the response message will be set to the same value as that in the requesting message sent by the client.
     */
    ackRequired: boolean;
    /** Reserved
     * @bitSize 6
     * @zeroIndexedLocation Byte 22, Bits 2-7.
     * @type
     */
    /** Wrap around message sequence number
     * @bitSize 8
     * @zeroIndexedLocation Byte 23.
     * @type uint8_t
     * @description The sequence number allows the client to provide a unique value,
     * which will be included by the LIFX device in any message that is sent in response to a message sent by the client.
     * This allows the client to distinguish between different messages sent with the same source identifier in the Frame.
     * See _ack_required_ and _res_required_ fields in the Frame Address.
     */
    sequence: number;
    /** Protocol Header */
    /** Variable length (body)
     * @bitSize 64
     * @zeroIndexedLocation Lowest octet: Byte 24. Highest octet: Byte 31.
     * @type uint64_t
     */
    /** Message type determines the payload being used
     * @bitSize 16
     * @zeroIndexedLocation Lower octet: Byte 32. Upper octet: Byte 33.
     * @type uint16_t
     */
    type: number;
}
/**
 * Packet types used by internal sending process
 */
export declare enum PACKET_TRANSACTION_TYPES {
    ONE_WAY = 0,
    REQUEST_RESPONSE = 1
}
/**
 * Definition of packet handler object
 */
export interface PacketBodyHandler {
    type: number;
    name: string;
    legacy: boolean;
    size: number;
    tagged: boolean;
    toObject?: Function;
    toBuffer?: Function;
}
/**
 * Parses a header buffer object into a Header object
 */
export declare function headerToObject(buf: Buffer): PacketHeader;
/**
 * Serializes a header object into a Header buffer
 */
export declare function headerToBuffer(obj: PacketHeader): Buffer;
/**
 * Parses a packet buffer into a packet object
 */
export declare function bufferToObject(buf: Buffer): any;
/**
 * Serializes a packet object into a packet buffer
 */
export declare function objectToBuffer(obj: any): Buffer;
/**
 * Creates a packet object
 */
export declare function createObject(type: number, params: any, source?: string, target?: string): any;
export declare function getPacketBodyHandlerByType(type: number): PacketBodyHandler;
export declare function getPacketBodyHandlerByName(name: string): PacketBodyHandler;
//# sourceMappingURL=packet.d.ts.map
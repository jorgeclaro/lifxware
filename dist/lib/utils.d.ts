/// <reference types="node" />
/**
 * Sleeps for a confugurable interval
 * @param milliseconds interval of sleep
 */
export declare function sleep(milliseconds: number): Promise<unknown>;
/**
 * Rounds expoential numbers
 * @param value value to round
 * @param decimals number of decimals
 */
export declare function round(value: number, decimals: number): number;
/**
 * Return all ip addresses of the machine
 * @return list containing ip address info
 */
export declare function getHostIPs(): string[];
/**
 * Validates a given ip address is IPv4 format
 * @param ip IP address to validate
 * @return is IPv4 format
 */
export declare function isIpv4Format(ip: string): boolean;
/**
 * Generates a random hex string of the given length
 * @param number length to generate
 * @return random hex string
 */
export declare function getRandomHexString(length?: number): string;
/**
 * Reads a little-endian unsigned 64-bit value and returns it as buffer
 * This function exists for easy replacing if a native method will be provided
 * by node.js and does not make sense like is
 * @param buffer buffer to read from
 * @param offset offset to begin reading from
 * @return resulting 64-bit buffer
 */
export declare function readUInt64LE(buffer: Buffer, offset: number): any;
/**
 * Writes a 64-bit value provided as buffer and returns the result
 * This function exists for easy replacing if a native method will be provided
 * by node.js and does not make sense like is
 * @param buffer buffer to write from
 * @param offset offset to begin reading from
 * @param input the buffer to write
 * @return resulting 64-bit buffer
 */
export declare function writeUInt64LE(buffer: Buffer, offset: number, input: any): any;
//# sourceMappingURL=utils.d.ts.map
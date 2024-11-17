import * as os from 'os';
// @ts-ignore
import fromExponential from 'from-exponential';
/**
 * Sleeps for a confugurable interval
 * @param milliseconds interval of sleep
 */
export function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
/**
 * Rounds expoential numbers
 * @param value value to round
 * @param decimals number of decimals
 */
export function round(value, decimals) {
    return Number(Math.round(Number(fromExponential(value + 'e' + decimals))) + 'e-' + decimals);
}
/**
 * Return all ip addresses of the machine
 * @return list containing ip address info
 */
export function getHostIPs() {
    const ips = [];
    const ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname].forEach((iface) => {
            ips.push(iface.address);
        });
    });
    return ips;
}
/**
 * Validates a given ip address is IPv4 format
 * @param ip IP address to validate
 * @return is IPv4 format
 */
export function isIpv4Format(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipv4Regex.test(ip);
}
/**
 * Generates a random hex string of the given length
 * @param number length to generate
 * @return random hex string
 */
export function getRandomHexString(length) {
    let string = '';
    const chars = '0123456789ABCDEF';
    if (!length) {
        length = 8;
    }
    for (let i = 0; i < length; i++) {
        const randomNumber = Math.floor(Math.random() * chars.length);
        string += chars.substring(randomNumber, randomNumber + 1);
    }
    return string;
}
/**
 * Reads a little-endian unsigned 64-bit value and returns it as buffer
 * This function exists for easy replacing if a native method will be provided
 * by node.js and does not make sense like is
 * @param buffer buffer to read from
 * @param offset offset to begin reading from
 * @return resulting 64-bit buffer
 */
export function readUInt64LE(buffer, offset) {
    return buffer.slice(offset, offset + 8);
}
/**
 * Writes a 64-bit value provided as buffer and returns the result
 * This function exists for easy replacing if a native method will be provided
 * by node.js and does not make sense like is
 * @param buffer buffer to write from
 * @param offset offset to begin reading from
 * @param input the buffer to write
 * @return resulting 64-bit buffer
 */
export function writeUInt64LE(buffer, offset, input) {
    return input.copy(buffer, offset, 0, 8);
}
//# sourceMappingURL=utils.js.map
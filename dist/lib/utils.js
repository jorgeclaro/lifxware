"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeUInt64LE = exports.readUInt64LE = exports.getRandomHexString = exports.isIpv4Format = exports.getHostIPs = exports.round = exports.sleep = void 0;
const os = require("os");
const fromExpoential = require("from-exponential");
/**
 * Sleeps for a confugurable interval
 * @param milliseconds interval of sleep
 */
function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
exports.sleep = sleep;
/**
 * Rounds expoential numbers
 * @param value value to round
 * @param decimals number of decimals
 */
function round(value, decimals) {
    return Number(Math.round(fromExpoential(value + 'e' + decimals)) + 'e-' + decimals);
}
exports.round = round;
/**
 * Return all ip addresses of the machine
 * @return list containing ip address info
 */
function getHostIPs() {
    const ips = [];
    const ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname].forEach((iface) => {
            ips.push(iface.address);
        });
    });
    return ips;
}
exports.getHostIPs = getHostIPs;
/**
 * Validates a given ip address is IPv4 format
 * @param ip IP address to validate
 * @return is IPv4 format
 */
function isIpv4Format(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipv4Regex.test(ip);
}
exports.isIpv4Format = isIpv4Format;
/**
 * Generates a random hex string of the given length
 * @param number length to generate
 * @return random hex string
 */
function getRandomHexString(length) {
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
exports.getRandomHexString = getRandomHexString;
/**
 * Reads a little-endian unsigned 64-bit value and returns it as buffer
 * This function exists for easy replacing if a native method will be provided
 * by node.js and does not make sense like is
 * @param buffer buffer to read from
 * @param offset offset to begin reading from
 * @return resulting 64-bit buffer
 */
function readUInt64LE(buffer, offset) {
    return buffer.slice(offset, offset + 8);
}
exports.readUInt64LE = readUInt64LE;
/**
 * Writes a 64-bit value provided as buffer and returns the result
 * This function exists for easy replacing if a native method will be provided
 * by node.js and does not make sense like is
 * @param buffer buffer to write from
 * @param offset offset to begin reading from
 * @param input the buffer to write
 * @return resulting 64-bit buffer
 */
function writeUInt64LE(buffer, offset, input) {
    return input.copy(buffer, offset, 0, 8);
}
exports.writeUInt64LE = writeUInt64LE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6QixtREFBbUQ7QUFFbkQ7OztHQUdHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLFlBQW9CO0lBQ3pDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBRkQsc0JBRUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLEtBQWEsRUFBRSxRQUFnQjtJQUNwRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQ3JGLENBQUM7QUFGRCxzQkFFQztBQUVEOzs7R0FHRztBQUNILFNBQWdCLFVBQVU7SUFDekIsTUFBTSxHQUFHLEdBQWEsRUFBRSxDQUFDO0lBQ3pCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBRXRDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ2hDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFYRCxnQ0FXQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixZQUFZLENBQUMsRUFBVTtJQUN0QyxNQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztJQUU1QyxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUpELG9DQUlDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLGtCQUFrQixDQUFDLE1BQWU7SUFDakQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDO0lBRWpDLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWixNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ1g7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2hDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5RCxNQUFNLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQzFEO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDZixDQUFDO0FBZkQsZ0RBZUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsU0FBZ0IsWUFBWSxDQUFDLE1BQWMsRUFBRSxNQUFjO0lBQzFELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBUSxDQUFDO0FBQ2hELENBQUM7QUFGRCxvQ0FFQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBRSxNQUFjLEVBQUUsS0FBVTtJQUN2RSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUZELHNDQUVDIn0=
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3pCLGFBQWE7QUFDYixPQUFPLGVBQWUsTUFBTSxrQkFBa0IsQ0FBQztBQUUvQzs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFDLFlBQW9CO0lBQ3pDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUMsS0FBYSxFQUFFLFFBQWdCO0lBQ3BELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUM7QUFDOUYsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxVQUFVO0lBQ3pCLE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztJQUN6QixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUV0QyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNoQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUM7QUFDWixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQUMsRUFBVTtJQUN0QyxNQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztJQUU1QyxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsTUFBZTtJQUNqRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUM7SUFFakMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDakMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlELE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFDLE1BQWMsRUFBRSxNQUFjO0lBQzFELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBUSxDQUFDO0FBQ2hELENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSxhQUFhLENBQUMsTUFBYyxFQUFFLE1BQWMsRUFBRSxLQUFVO0lBQ3ZFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxDQUFDIn0=
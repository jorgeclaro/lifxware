"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagLabels = void 0;
const utils = require("../../lib/utils");
const error_1 = require("../../lib/error");
const packetErrors_1 = require("../../errors/packetErrors");
const SIZE = 8;
function toObject(buf) {
    let offset = 0;
    if (buf.length !== SIZE) {
        throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_INVALID_SIZE).build();
    }
    const tagLabels = utils.readUInt64LE(buf, offset);
    offset += 2;
    const obj = {
        tagLabels
    };
    return obj;
}
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    buf.write(obj.tagLabels, offset, 32, 'utf8');
    offset += 2;
    return buf;
}
exports.getTagLabels = {
    type: 29,
    name: 'getTagLabels',
    legacy: true,
    size: SIZE,
    tagged: false,
    toObject,
    toBuffer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0VGFnTGFiZWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvdGFnTGFiZWwvZ2V0VGFnTGFiZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUF5QztBQUd6QywyQ0FBc0Q7QUFDdEQsNERBQW1FO0FBRW5FLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztBQUVmLFNBQVMsUUFBUSxDQUFDLEdBQVc7SUFDNUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtRQUN4QixNQUFNLElBQUksMkJBQW1CLENBQUMscUNBQXNCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM5RDtJQUVELE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRWxELE1BQU0sSUFBSSxDQUFDLENBQUM7SUFFWixNQUFNLEdBQUcsR0FBYztRQUN0QixTQUFTO0tBQ1QsQ0FBQztJQUVGLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQWM7SUFDL0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUvQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1osSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0MsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVZLFFBQUEsWUFBWSxHQUFzQjtJQUM5QyxJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxjQUFjO0lBQ3BCLE1BQU0sRUFBRSxJQUFJO0lBQ1osSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsS0FBSztJQUNiLFFBQVE7SUFDUixRQUFRO0NBQ1IsQ0FBQyJ9
# LIFXware

A Typescript implementation of the [LIFX protocol](https://github.com/LIFX/lifx-protocol-docs).

This library is not, in any way, affiliated or related to LiFi Labs, Inc.. Use it at your own risk.

## Installation

```sh
$ npm install lifxware --save
```

## Usage

The file `cli.ts` contains a working cli example.

### Client

The library uses a client for network communication. This client handles communication with all lights in the network.

```js
const Client = require('node-lifx').Client;
const client = new Client();
```

The `Client` object is an EventEmitter and emmits events whenever any changes occur. This can be a new light discovery, a light sending a message or similar.
The client starts discovery of lights upon it's creation. If a new light is found the client emmits a `light-new` event. This event contains the light as an object on which methods can be called then:

```js
const Client = require('node-lifx').Client;
const client = new Client();

client.on('light-new', (light) => {
	// Change light state here
});
```

### Client settings

For the initialization of the client different settings can be provided.
This is an example with the default options:

```js
const Client = require('node-lifx').Client;
const client = new Client({
	lightOfflineTolerance: 3, // A light is offline if not seen for the given amount of discoveries
	messageHandlerTimeout: 45000, // in ms, if not answer in time an error is provided to get methods
	startDiscovery: true, // start discovery after initialization
	resendPacketDelay: 150, // delay between packages if light did not receive a packet (for setting methods with callback)
	resendMaxTimes: 3, // resend packages x times if light did not receive a packet (for setting methods with callback)
	debug: false, // logs all messages in console if turned on
	address: '0.0.0.0', // the IPv4 address to bind the udp connection to
	broadcast: '255.255.255.255', // set's the IPv4 broadcast address which is addressed to discover bulbs
	lights: [] // Can be used provide a list of known light IPv4 ip addresses if broadcast packets in network are not allowed
	// For example: ['192.168.0.112', '192.168.0.114'], this will then be addressed directly
});

client.on('light-new', (light) => {
	// Change light state here
});
```

### Light discovery

The discovery for each client can be started and stopped at runtime using these commands:

#### `client.startDiscovery()`

```js
try {
	await client.startDiscovery();
} catch (err) {
	logger.error(err);
}
```

Starts the discovery process.

#### `client.stopDiscovery()`

Stops the discovery process.
s

```js
try {
	await client.stopDiscovery();
} catch (err) {
	logger.error(err);
}
```

### Changing light state

The states of a light can be changed with different methods:

#### `light.setPower(power, [duration])`

This turns a light on.

| Option     | Type    | Default | Description                                                   |
| ---------- | ------- | ------- | ------------------------------------------------------------- |
| `power`    | boolean | 1       | Turn on / off                                                 |
| `duration` | int     | 0       | Turning on/off will be faded over the time (in milliseconds). |

The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

Usage examples:

```js
try {
	// Turns the light on instantly
	await light.setPower(true);
} catch (err) {
	logger.error(err);
}

try {
	// Fading the light on over two seconds
	await light.setPower(true, 2000);
} catch (err) {
	logger.error(err);
}
```

#### `light.getColor([cache], [duration])`

Gets the color of a light in HSB color values. This is the preferred method to get the color of a light.

| Option     | Type | Default | Description                   |
| ---------- | ---- | ------- | ----------------------------- |
| `duration` | int  | 0       | Gets the current light color. |

The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

Usage examples:

```js
try {
	const data = await light.getColor();
	logger.info(data);
} catch (err) {
	logger.error(err);
}

try {
	//Cached
	const data = await light.getColor(true);
	logger.info(data);
} catch (err) {
	logger.error(err);
}
```

Example result:

```json
{
	"hue": 321,
	"saturation": 15,
	"brightness": 66,
	"kelvin": 3600
}
```

#### `light.setColor(hue, saturation, brightness, [kelvin], [duration])`

Changes the color of a light to an HSB color value. This is the preferred method to change the color of a light.

| Option       | Type | Default | Description                                                                      |
| ------------ | ---- | ------- | -------------------------------------------------------------------------------- |
| `hue`        | int  |         | Between 0 and 360, representing the color hue in degree which changes the color. |
| `saturation` | int  |         | Between 0 and 100, representing the color intensity from 0% to 100%.             |
| `brightness` | int  |         | Between 0 and 100, representing the light brightness from 0% to 100%.            |
| `kelvin`     | int  | 3500    | Between 2500 and 9000, representing the color temperature.                       |
| `duration`   | int  | 0       | Fade the color to the new value over time (in milliseconds).                     |

The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

Usage examples:

```js
try {
	// Set to red at 50% brightness
	await light.setColor(0, 100, 50);
} catch (err) {
	logger.error(err);
}

try {
	// Set to a light green at 80% brightness over next two seconds
	await light.setColor(50, 50, 80, 3500, 2000s);
} catch (err) {
	logger.error(err);
}
```

#### `light.setColorRgbHex(hexString, [duration])`

Changes the color of a light to an RGB color value given in Hex Format. Note that RGB poorly represents color of light,
prefer HSBK values given via the `color` method.

| Option      | Type   | Default | Description                                                  |
| ----------- | ------ | ------- | ------------------------------------------------------------ |
| `hexString` | string |         | A hex RGB string starting with `#`                           |
| `duration`  | int    | 0       | Fade the color to the new value over time (in milliseconds). |

The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

Usage examples:

```js
try {
	// Set to red
	await light.setColorRgbHex('#F00');
} catch (err) {
	logger.error(err);
}

try {
	// Set to yellow
	await light.setColorRgbHex('#FFFF00');
} catch (err) {
	logger.error(err);
}
```

#### `light.setColorRgb(red, green, blue, [duration])`

Changes the color of a light to an RGB color value. Note that RGB poorly represents color of light,
prefer HSBK values given via the `color` method.

| Option     | Type | Default | Description                                                  |
| ---------- | ---- | ------- | ------------------------------------------------------------ |
| `red`      | int  |         | Amout of red in color from 0 to 255                          |
| `green`    | int  |         | Amout of green in color from 0 to 255                        |
| `blue`     | int  |         | Amout of blue in color from 0 to 255                         |
| `duration` | int  | 0       | Fade the color to the new value over time (in milliseconds). |

The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

Usage examples:

```js
try {
	// Set to red
	await light.setColorRgb(255, 0, 0);
} catch (err) {
	logger.error(err);
}

try {
	// Set to yellow
	await light.setColorRgb(255, 255, 0);
} catch (err) {
	logger.error(err);
}
```

#### `light.getInfrared([duration])`

Requests the maximum infrared brightness of the light (only for lights that support infrared light)
The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

Usage examples:

```js
try {
	const ir = await light.getInfrared();
	logger.info(ir);
} catch (err) {
	logger.error(err);
}
```

Example result:

```json
{
	"brightness": 25
}
```

#### `light.setInfrared(brightness, [duration])`

Set's the maximum infrared brightness of the light (only for lights that support infrared light)

| Option       | Type | Default | Description                                                           |
| ------------ | ---- | ------- | --------------------------------------------------------------------- |
| `brightness` | int  |         | Between 0 and 100, representing the light brightness from 0% to 100%. |

The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

Usage examples:

```js
try {
	const ir = await light.setInfrared(25);
	logger.info(ir);
} catch (err) {
	logger.error(err);
}
```

Example result:

```json
{
	"brightness": 25
}
```

### Requesting light state and info

Infos of the state and spec of the light can be requested with the following methods:

#### `light.getState([cache])`

Requests general info from a light, this includes color, label and power state. This function is asynchronous.
The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

Usage examples:

```js
try {
	const state = await light.getState();
	logger.info(state);
} catch (err) {
	logger.error(err);
}

try {
	const state = await light.getState(true);
	logger.info(state);
} catch (err) {
	logger.error(err);
}
```

Example result:

```json
{
	"color": {
		"hue": 120,
		"saturation": 0,
		"brightness": 100,
		"kelvin": 8994
	},
	"power": false,
	"connectivity": true
}
```

#### `light.getPower([cache])`

Requests current power state (on or off). This function is asynchronous.
The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

Usage examples:

```js
try {
	const power = await light.getPower();
	logger.info(power);
} catch (err) {
	logger.error(err);
}

try {
	//Cached
	const power = await light.getPower(true);
	logger.info(power);
} catch (err) {
	logger.error(err);
}
```

Example result:

```js
true; //On
```

#### `light.getFirmwareVersion()`

Requests the firmware version from a light (minor and major version). This function is asynchronous.
The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

```js
try {
	const firmwareVersion = await light.getFirmwareVersion();
	logger.info(firmwareVersion);
} catch (err) {
	logger.error(err);
}
```

Example result:

```json
{
	"majorVersion": 2,
	"minorVersion": 1
}
```

#### `light.getHardwareVersion()`

Requests the hardware version from a light (vendor, product and version). This function is asynchronous.
The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

```js
try {
	const hardwareVersion = await light.getHardwareVersion();
	logger.info(hardwareVersion);
} catch (err) {
	logger.error(err);
}
```

Example result:

```json
{
	"vendorId": 1,
	"vendorName": "LIFX",
	"productId": 1,
	"productName": "Original 1000",
	"version": 6,
	"productFeatures": {
		"color": true,
		"infrared": false,
		"multizone": false
	}
}
```

#### `light.getFirmwareInfo()`

Requests info from the micro controller unit of a light (signal, tx and rx). This function is asynchronous.
The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

```js
try {
	const firmwareInfo = await light.getFirmwareInfo();
	logger.info(firmwareInfo);
} catch (err) {
	logger.error(err);
}
```

Example result:

```json
{
	"signal": 0,
	"tx": 0,
	"rx": 0
}
```

#### `light.getWifiInfo()`

Requests wifi info from a light (signal, tx and rx). This function is asynchronous.
The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

```js
try {
	const wifiInfo = await light.getWifiInfo();
	logger.info(wifiInfo);
} catch (err) {
	logger.error(err);
}
```

Example result:

```json
{
	"signal": 0.000009999999747378752,
	"tx": 16584,
	"rx": 12580
}
```

#### `light.getWifiVersion()`

Requests the wifi firmware version from the light (minor and major version). This function is asynchronous.
The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

```js
try {
	const wifiVersion = await light.getWifiVersion();
	logger.info(wifiVersion);
} catch (err) {
	logger.error(err);
}
```

Example result:

```json
{
	"majorVersion": 2,
	"minorVersion": 1
}
```

#### `light.getAmbientLight()`

Requests the ambient light value in flux from the light. This function is asynchronous.
The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

```js
try {
	const ambientLight = await light.getAmbientLight();
	logger.info(ambientLight);
} catch (err) {
	logger.error(err);
}
```

Example result:

```js
10;
```

### Labels

Labels of lights can be requested and set using the following methods:

#### `light.getLabel([cache])`

Requests the label of a light. This function is asynchronous.

| Option  | Type    | Default | Description                                                                        |
| ------- | ------- | ------- | ---------------------------------------------------------------------------------- |
| `cache` | boolean | false   | Use the last known value for the label and and do not request from the light again |

The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

```js
try {
	const label = await light.getLabel();
	logger.info(label);
} catch (err) {
	logger.error(err);
}
```

Example result:

```js
'Kitchen';
```

#### `light.setLabel(label)`

Sets a new label for a light.

| Option  | Type   | Default | Description                                                                          |
| ------- | ------ | ------- | ------------------------------------------------------------------------------------ |
| `label` | string |         | New Label with 32 bit size maximum (which is a length of 32 with non unicode chars). |

The function will return a promise.
If the light has been reached with success, the promise will be resolved, otherwise it will be rejected after `client.resendMaxTimes` with `client.resendPacketDelay` in case it has not.

```js
try {
	const label = await light.setLabel('label1');
	logger.info(label);
} catch (err) {
	logger.error(err);
}
```

Example result:

```js
'Bedroom Light';
```

### Get a light

#### `client.light(identifier)`

Find a light in the list off all lights by ip, label or id.

| Option       | Type   | Default | Description           |
| ------------ | ------ | ------- | --------------------- |
| `identifier` | string |         | Light IP, Label or id |

Returns a light object that can then be used to call methods on it. For example `client.light('192.168.2.102').on()`.

```js
try {
	const light = await client.light('label1');
} catch (err) {
	logger.error(err);
}
```

### Get all lights

#### `client.lights([filter])`

Get a list of all known lights

| Option   | Type   | Default | Description                                                                                      |
| -------- | ------ | ------- | ------------------------------------------------------------------------------------------------ |
| `filter` | string | null    | Filter list of lights to return only active (`null` or `'on'`), inactive (`'off'`) or all (`''`) |

```js
try {
	const light = await client.lights('on');
} catch (err) {
	logger.error(err);
}

try {
	const light = await client.lights('off');
} catch (err) {
	logger.error(err);
}
```

### Light events

The following events might be thrown by the light.

#### `connectivity`

This event is thrown when the light becomes online or offline.

`client.on('connectivity', (connectivity) => {});`

#### `power`

This event is thrown when the light changes its power state.

`client.on('power', (power) => {});`

#### `color`

This event is thrown when the light changes its color.

`client.on('color', (color) => {});`

#### `state`

This event is thrown when the light changes its power state, color or online status.

`client.on('state', (state) => {});`

#### `label`

This event is thrown when the light changes its label.

`client.on('label', (label) => {});`

### Client events

The following events might be thrown by the client.

#### `light-new`

This event is thrown when there is a new light discovery that has not been seen at runtime before. This event is provided with the new light object.

`client.on('light-new', (light) => {});`

#### `light-connectivity`

This event is thrown whenever one of the already discovered lights become online or offline. This event is provided with the correspondent light object.

`client.on('light-connectivity', (light) => {});`

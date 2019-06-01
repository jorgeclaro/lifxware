import { ColorHSBK } from '../color/colorHSBK';

export interface Tile {
	/**
	 * Acceleration xyz axis
	 * @type signed 16-bit integer each
	 */
	accel_meas_x: number;
	accel_meas_y: number;
	accel_meas_z: number;

	/**
	 * Reserved
	 * @type signed 16-bit integer
	 */

	/**
	 * The user_x and user_y fields are used to record the position of each tile.
	 * @type signed 16-bit integer each
	 */
	user_x: number;
	user_y: number;

	/**
	 * Width and Height postion
	 * @type unsigned 8-bit integer each
	 */
	width: number;
	height: number;

	/**
	 * Reserved
	 * @type unsigned 8-bit integer
	 */

	/**
	 * Device version info
	 * The device_version Fields are the same as those in a StateVersion message.
	 * @type unsigned 32-bit integer each
	 */
	device_version_vendor: number;
	device_version_product: number;
	device_version_version: number;

	/**
	 * Firmware buid info
	 * The firmware_build field is the same a StateVersion message
	 * @type unsigned 64-bit integer
	 */
	firmware_build: number; //unsigned 64-bit integer

	/**
	 * Reserved
	 * @type unsigned 64-bit integer
	 */

	/**
	 * Firmware version info
	 * The firmware_version field is the same a StateHostFirmware message
	 * @type unsigned 16-bit integer
	 */
	firmware_version_minor: number;
	firmware_version_major: number;

	/**
	 * Reserved
	 * @type 	unsigned 32-bit integer
	 */
}

/*
 * Response from `GetDeviceChain` message
 * This message returns information about the tiles in the chain
 */
export interface StateDeviceChainResponse {
	start_index: number; //unsigned 8-bit integer
	tile_devices: Tile[]; //16 Tile
	total_count: number; //unsigned 8-bit integer
}

/**
 * Used to tell each tile what their position is
 */
export interface SetUserPositionRequest {
	/**
	 * The tile_index is a 0 based index used to address a particular tile in the chain.
	 * unsigned 8-bit integer
	 */
	tile_index: number;

	//reserved	unsigned 16-bit integer

	/**
	 * The user_x and user_y fields are used to record the position of each tile.
	 * Be very careful when setting these values, as it has the chance to greatly upset users if you get it wrong.
	 * Make sure you have read, and fully understand the information on the Tile Control page before setting these values.
	 * 32-bit float
	 */
	user_x: number;
	user_y: number;
}

export interface GetTileState64Request {
	/**
	 * The tile_index is used to control the starting tile in the chain.
	 * unsigned 8-bit integer
	 */
	tile_index: number;

	/**
	 * Length is used to get the state of that many tiles beginning from the tile_index.
	 * This will result in a separate response from each tile.
	 * unsigned 8-bit integer
	 */
	length: number;

	//reserved: number; //unsigned 8-bit integer

	x: number; //unsigned 8-bit integer
	y: number; //unsigned 8-bit integer
	width: number; //unsigned 8-bit integer
}

export interface SetTileState64Request extends GetTileState64Request {
	duration: number; //unsigned 32-bit integer
	colors: ColorHSBK[]; //64 HSBK values
}

export interface StateTileState64Response extends SetTileState64Request {}

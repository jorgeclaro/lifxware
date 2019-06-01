/**
 * Device related packages
 */
import { getService } from './service/getService';
import { stateService } from './service/stateService';
import { getTime } from './time/getTime';
import { setTime } from './time/setTime';
import { stateTime } from './time/stateTime';
import { getResetSwitchState } from './resetSwitch/getResetSwitch';
import { stateResetSwitch } from './resetSwitch/stateResetSwitch';
import { getDummyLoad } from './dummyLoad/getDummyLoad';
import { setDummyLoad } from './dummyLoad/setDummyLoad';
import { stateDummyLoad } from './dummyLoad/stateDummyLoad';
import { getHostInfo } from './hostInfo/getHostInfo';
import { stateHostInfo } from './hostInfo/stateHostInfo';
import { getHostFirmware } from './hostFirmware/getHostFirmware';
import { stateHostFirmware } from './hostFirmware/stateHostFirmware';
import { getWifiInfo } from './wifiInfo/getWifiInfo';
import { stateWifiInfo } from './wifiInfo/stateWifiInfo';
import { getWifiFirmware } from './wifiFirmware/getWifiFirmware';
import { stateWifiFirmware } from './wifiFirmware/stateWifiFirmware';
import { getLabel } from './label/getLabel';
import { setLabel } from './label/setLabel';
import { stateLabel } from './label/stateLabel';
import { getTags } from './tag/getTags';
import { setTags } from './tag/setTags';
import { stateTags } from './tag/stateTags';
import { getTagLabels } from './tagLabel/getTagLabels';
import { setTagLabels } from './tagLabel/setTagLabels';
import { stateTagLabels } from './tagLabel/stateTagLabels';
import { getPower } from './power/getPower';
import { setPower } from './power/setPower';
import { statePower } from './power/statePower';
import { getPowerLegacy } from './power/getPowerLegacy';
import { setPowerLegacy } from './power/setPowerLegacy';
import { statePowerLegacy } from './power/statePowerLegacy';
import { getVersion } from './version/getHardwareVersion';
import { stateVersion } from './version/stateHardwareVersion';
import { getInfo } from './info/getInfo';
import { stateInfo } from './info/stateInfo';
import { getMcuRailVoltage } from './mcuRailVoltage/getMcuRailVoltage';
import { stateMcuRailVoltage } from './mcuRailVoltage/stateMcuRailVoltage';
import { reboot } from './others/reboot';
import { setFactoryTestModeActive } from './factoryTestMode/setFactoryTestModeActive';
import { setFactoryTestModeInactive } from './factoryTestMode/setFactoryTestModeInactive';
import { acknowledgement } from './others/acknowledgement';
import { echoRequest } from './echo/echoRequest';
import { echoResponse } from './echo/echoResponse';
import { getLocation } from './location/getLocation';
import { stateLocation } from './location/stateLocation';
import { getOwner } from './owner/getOwner';
import { setOwner } from './owner/setOwner';
import { stateOwner } from './owner/stateOwner';
import { getGroup } from './group/getGroup';
import { setGroup } from './group/setGroup';
import { stateGroup } from './group/stateGroup';

/**
 * Light device related packages
 */
import { getLight } from './lightState/getLightState';
import { stateLight } from './lightState/stateLightState';
import { setColor } from './color/setColor';
import { setWaveform } from './waveform/setWaveform';
import { setWaveformOptional } from './waveform/setWaveformOptional';
import { setDimAbsolute } from './dimmer/setDimAbsolute';
import { setDimRelative } from './dimmer/setDimRelative';
import { setLightColorRGBW } from './colorRGBW/setColorRGBW';
import { getTemperature } from './temperature/getTemperature';
import { stateTemperature } from './temperature/stateTemperature';
import { getInfrared } from './infrared/getInfrared';
import { setInfrared } from './infrared/setInfrared';
import { stateInfrared } from './infrared/stateInfrared';
import { stateWanConnection } from './wan/stateWanConnection';
import { setWanSubsActive } from './wan/setWanSubsActive';
import { seWwanSubsInactive } from './wan/setWanSubsInactive';
import { stateWanSubscription } from './wan/stateWanSubscription';
import { getWifiState } from './wifiState/getWifiState';
import { setWifiState } from './wifiState/setWifiState';
import { stateWifiState } from './wifiState/stateWifiState';
import { getAccessPoints } from './accessPoint/getAccessPoints';
import { setAccessPoints } from './accessPoint/setAccessPoints';
import { stateAccessPoints } from './accessPoint/stateAccessPoints';

/**
 * Sensor related packages
 */
import { getAmbientLight } from './ambientLight/getAmbientLight';
import { stateAmbientLight } from './ambientLight/stateAmbientLight';
import { getDimmerVoltage } from './dimmerVoltage/getDimmerVoltage';
import { stateDimmerVoltage } from './dimmerVoltage/stateDimmerVoltage';

/**
 * MultiZone device related packages
 */
import { getColorZone } from './colorZone/getColorZone';
import { setColorZone } from './colorZone/setColorZone';
import { stateZone } from './colorZone/stateColorZone';
import { getCountZone } from './countZone/getCountZone';
import { stateCountZone } from './countZone/stateCountZone';
import { stateMultiZone } from './colorZone/stateColorMultiZone';

/**
 * Tile packets
 */
import { getDeviceChain } from './tiles/getDeviceChain';
import { getTileState64 } from './tiles/getTileState64';
import { setTileState64 } from './tiles/setTileState64';
import { setUserPosition } from './tiles/setUserPosition';
import { stateDeviceChain } from './tiles/stateDeviceChain';
import { stateTileState64 } from './tiles/stateTileState64';

/** Unknown packets */
import { updateWanInfo } from './unknown/updateWanInfo';

export const packet = {
	getService,
	stateService,
	getTime,
	setTime,
	stateTime,
	getResetSwitchState,
	stateResetSwitch,
	getDummyLoad,
	setDummyLoad,
	dummyLoad: stateDummyLoad,
	getHostInfo,
	stateHostInfo,
	getHostFirmware,
	stateHostFirmware,
	getWifiInfo,
	stateWifiInfo,
	getWifiFirmware,
	stateWifiFirmware,
	getLabel,
	setLabel,
	stateLabel,
	getTags,
	setTags,
	stateTags,
	getTagLabels,
	setTagLabels,
	stateTagLabels,
	getPower,
	setPower,
	statePower,
	getPowerLegacy,
	setPowerLegacy,
	statePowerLegacy,
	getVersion,
	stateVersion,
	getInfo,
	stateInfo,
	getMcuRailVoltage,
	stateMcuRailVoltage,
	reboot,
	setFactoryTestModeActive,
	setFactoryTestModeInactive,
	acknowledgement,
	echoRequest,
	echoResponse,
	getLocation,
	stateLocation,
	getOwner,
	setOwner,
	stateOwner,
	getGroup,
	setGroup,
	stateGroup,

	getLight,
	stateLight,
	setColor,
	setWaveform,
	setWaveformOptional,
	setDimAbsolute,
	setDimRelative,
	setLightColorRGBW,
	getTemperature,
	stateTemperature,
	getInfrared,
	setInfrared,
	stateInfrared,
	stateWanConnection,
	setWanSubsActive,
	seWwanSubsInactive,
	stateWanSubscription,
	getWifiState,
	setWifiState,
	stateWifiState,
	getAccessPoints,
	setAccessPoints,
	stateAccessPoints,

	getAmbientLight,
	stateAmbientLight,
	getDimmerVoltage,
	stateDimmerVoltage,

	getColorZone,
	setColorZone,
	stateZone,
	getCountZone,
	stateCountZone,
	stateMultiZone,

	getDeviceChain,
	getTileState64,
	setTileState64,
	setUserPosition,
	stateDeviceChain,
	stateTileState64,

	updateWanInfo
};

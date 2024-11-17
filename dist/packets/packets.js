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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYWNrZXRzL3BhY2tldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFr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
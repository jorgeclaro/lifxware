"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packet = void 0;
/**
 * Device related packages
 */
const getService_1 = require("./service/getService");
const stateService_1 = require("./service/stateService");
const getTime_1 = require("./time/getTime");
const setTime_1 = require("./time/setTime");
const stateTime_1 = require("./time/stateTime");
const getResetSwitch_1 = require("./resetSwitch/getResetSwitch");
const stateResetSwitch_1 = require("./resetSwitch/stateResetSwitch");
const getDummyLoad_1 = require("./dummyLoad/getDummyLoad");
const setDummyLoad_1 = require("./dummyLoad/setDummyLoad");
const stateDummyLoad_1 = require("./dummyLoad/stateDummyLoad");
const getHostInfo_1 = require("./hostInfo/getHostInfo");
const stateHostInfo_1 = require("./hostInfo/stateHostInfo");
const getHostFirmware_1 = require("./hostFirmware/getHostFirmware");
const stateHostFirmware_1 = require("./hostFirmware/stateHostFirmware");
const getWifiInfo_1 = require("./wifiInfo/getWifiInfo");
const stateWifiInfo_1 = require("./wifiInfo/stateWifiInfo");
const getWifiFirmware_1 = require("./wifiFirmware/getWifiFirmware");
const stateWifiFirmware_1 = require("./wifiFirmware/stateWifiFirmware");
const getLabel_1 = require("./label/getLabel");
const setLabel_1 = require("./label/setLabel");
const stateLabel_1 = require("./label/stateLabel");
const getTags_1 = require("./tag/getTags");
const setTags_1 = require("./tag/setTags");
const stateTags_1 = require("./tag/stateTags");
const getTagLabels_1 = require("./tagLabel/getTagLabels");
const setTagLabels_1 = require("./tagLabel/setTagLabels");
const stateTagLabels_1 = require("./tagLabel/stateTagLabels");
const getPower_1 = require("./power/getPower");
const setPower_1 = require("./power/setPower");
const statePower_1 = require("./power/statePower");
const getPowerLegacy_1 = require("./power/getPowerLegacy");
const setPowerLegacy_1 = require("./power/setPowerLegacy");
const statePowerLegacy_1 = require("./power/statePowerLegacy");
const getHardwareVersion_1 = require("./version/getHardwareVersion");
const stateHardwareVersion_1 = require("./version/stateHardwareVersion");
const getInfo_1 = require("./info/getInfo");
const stateInfo_1 = require("./info/stateInfo");
const getMcuRailVoltage_1 = require("./mcuRailVoltage/getMcuRailVoltage");
const stateMcuRailVoltage_1 = require("./mcuRailVoltage/stateMcuRailVoltage");
const reboot_1 = require("./others/reboot");
const setFactoryTestModeActive_1 = require("./factoryTestMode/setFactoryTestModeActive");
const setFactoryTestModeInactive_1 = require("./factoryTestMode/setFactoryTestModeInactive");
const acknowledgement_1 = require("./others/acknowledgement");
const echoRequest_1 = require("./echo/echoRequest");
const echoResponse_1 = require("./echo/echoResponse");
const getLocation_1 = require("./location/getLocation");
const stateLocation_1 = require("./location/stateLocation");
const getOwner_1 = require("./owner/getOwner");
const setOwner_1 = require("./owner/setOwner");
const stateOwner_1 = require("./owner/stateOwner");
const getGroup_1 = require("./group/getGroup");
const setGroup_1 = require("./group/setGroup");
const stateGroup_1 = require("./group/stateGroup");
/**
 * Light device related packages
 */
const getLightState_1 = require("./lightState/getLightState");
const stateLightState_1 = require("./lightState/stateLightState");
const setColor_1 = require("./color/setColor");
const setWaveform_1 = require("./waveform/setWaveform");
const setWaveformOptional_1 = require("./waveform/setWaveformOptional");
const setDimAbsolute_1 = require("./dimmer/setDimAbsolute");
const setDimRelative_1 = require("./dimmer/setDimRelative");
const setColorRGBW_1 = require("./colorRGBW/setColorRGBW");
const getTemperature_1 = require("./temperature/getTemperature");
const stateTemperature_1 = require("./temperature/stateTemperature");
const getInfrared_1 = require("./infrared/getInfrared");
const setInfrared_1 = require("./infrared/setInfrared");
const stateInfrared_1 = require("./infrared/stateInfrared");
const stateWanConnection_1 = require("./wan/stateWanConnection");
const setWanSubsActive_1 = require("./wan/setWanSubsActive");
const setWanSubsInactive_1 = require("./wan/setWanSubsInactive");
const stateWanSubscription_1 = require("./wan/stateWanSubscription");
const getWifiState_1 = require("./wifiState/getWifiState");
const setWifiState_1 = require("./wifiState/setWifiState");
const stateWifiState_1 = require("./wifiState/stateWifiState");
const getAccessPoints_1 = require("./accessPoint/getAccessPoints");
const setAccessPoints_1 = require("./accessPoint/setAccessPoints");
const stateAccessPoints_1 = require("./accessPoint/stateAccessPoints");
/**
 * Sensor related packages
 */
const getAmbientLight_1 = require("./ambientLight/getAmbientLight");
const stateAmbientLight_1 = require("./ambientLight/stateAmbientLight");
const getDimmerVoltage_1 = require("./dimmerVoltage/getDimmerVoltage");
const stateDimmerVoltage_1 = require("./dimmerVoltage/stateDimmerVoltage");
/**
 * MultiZone device related packages
 */
const getColorZone_1 = require("./colorZone/getColorZone");
const setColorZone_1 = require("./colorZone/setColorZone");
const stateColorZone_1 = require("./colorZone/stateColorZone");
const getCountZone_1 = require("./countZone/getCountZone");
const stateCountZone_1 = require("./countZone/stateCountZone");
const stateColorMultiZone_1 = require("./colorZone/stateColorMultiZone");
/**
 * Tile packets
 */
const getDeviceChain_1 = require("./tiles/getDeviceChain");
const getTileState64_1 = require("./tiles/getTileState64");
const setTileState64_1 = require("./tiles/setTileState64");
const setUserPosition_1 = require("./tiles/setUserPosition");
const stateDeviceChain_1 = require("./tiles/stateDeviceChain");
const stateTileState64_1 = require("./tiles/stateTileState64");
/** Unknown packets */
const updateWanInfo_1 = require("./unknown/updateWanInfo");
exports.packet = {
    getService: getService_1.getService,
    stateService: stateService_1.stateService,
    getTime: getTime_1.getTime,
    setTime: setTime_1.setTime,
    stateTime: stateTime_1.stateTime,
    getResetSwitchState: getResetSwitch_1.getResetSwitchState,
    stateResetSwitch: stateResetSwitch_1.stateResetSwitch,
    getDummyLoad: getDummyLoad_1.getDummyLoad,
    setDummyLoad: setDummyLoad_1.setDummyLoad,
    dummyLoad: stateDummyLoad_1.stateDummyLoad,
    getHostInfo: getHostInfo_1.getHostInfo,
    stateHostInfo: stateHostInfo_1.stateHostInfo,
    getHostFirmware: getHostFirmware_1.getHostFirmware,
    stateHostFirmware: stateHostFirmware_1.stateHostFirmware,
    getWifiInfo: getWifiInfo_1.getWifiInfo,
    stateWifiInfo: stateWifiInfo_1.stateWifiInfo,
    getWifiFirmware: getWifiFirmware_1.getWifiFirmware,
    stateWifiFirmware: stateWifiFirmware_1.stateWifiFirmware,
    getLabel: getLabel_1.getLabel,
    setLabel: setLabel_1.setLabel,
    stateLabel: stateLabel_1.stateLabel,
    getTags: getTags_1.getTags,
    setTags: setTags_1.setTags,
    stateTags: stateTags_1.stateTags,
    getTagLabels: getTagLabels_1.getTagLabels,
    setTagLabels: setTagLabels_1.setTagLabels,
    stateTagLabels: stateTagLabels_1.stateTagLabels,
    getPower: getPower_1.getPower,
    setPower: setPower_1.setPower,
    statePower: statePower_1.statePower,
    getPowerLegacy: getPowerLegacy_1.getPowerLegacy,
    setPowerLegacy: setPowerLegacy_1.setPowerLegacy,
    statePowerLegacy: statePowerLegacy_1.statePowerLegacy,
    getVersion: getHardwareVersion_1.getVersion,
    stateVersion: stateHardwareVersion_1.stateVersion,
    getInfo: getInfo_1.getInfo,
    stateInfo: stateInfo_1.stateInfo,
    getMcuRailVoltage: getMcuRailVoltage_1.getMcuRailVoltage,
    stateMcuRailVoltage: stateMcuRailVoltage_1.stateMcuRailVoltage,
    reboot: reboot_1.reboot,
    setFactoryTestModeActive: setFactoryTestModeActive_1.setFactoryTestModeActive,
    setFactoryTestModeInactive: setFactoryTestModeInactive_1.setFactoryTestModeInactive,
    acknowledgement: acknowledgement_1.acknowledgement,
    echoRequest: echoRequest_1.echoRequest,
    echoResponse: echoResponse_1.echoResponse,
    getLocation: getLocation_1.getLocation,
    stateLocation: stateLocation_1.stateLocation,
    getOwner: getOwner_1.getOwner,
    setOwner: setOwner_1.setOwner,
    stateOwner: stateOwner_1.stateOwner,
    getGroup: getGroup_1.getGroup,
    setGroup: setGroup_1.setGroup,
    stateGroup: stateGroup_1.stateGroup,
    getLight: getLightState_1.getLight,
    stateLight: stateLightState_1.stateLight,
    setColor: setColor_1.setColor,
    setWaveform: setWaveform_1.setWaveform,
    setWaveformOptional: setWaveformOptional_1.setWaveformOptional,
    setDimAbsolute: setDimAbsolute_1.setDimAbsolute,
    setDimRelative: setDimRelative_1.setDimRelative,
    setLightColorRGBW: setColorRGBW_1.setLightColorRGBW,
    getTemperature: getTemperature_1.getTemperature,
    stateTemperature: stateTemperature_1.stateTemperature,
    getInfrared: getInfrared_1.getInfrared,
    setInfrared: setInfrared_1.setInfrared,
    stateInfrared: stateInfrared_1.stateInfrared,
    stateWanConnection: stateWanConnection_1.stateWanConnection,
    setWanSubsActive: setWanSubsActive_1.setWanSubsActive,
    seWwanSubsInactive: setWanSubsInactive_1.seWwanSubsInactive,
    stateWanSubscription: stateWanSubscription_1.stateWanSubscription,
    getWifiState: getWifiState_1.getWifiState,
    setWifiState: setWifiState_1.setWifiState,
    stateWifiState: stateWifiState_1.stateWifiState,
    getAccessPoints: getAccessPoints_1.getAccessPoints,
    setAccessPoints: setAccessPoints_1.setAccessPoints,
    stateAccessPoints: stateAccessPoints_1.stateAccessPoints,
    getAmbientLight: getAmbientLight_1.getAmbientLight,
    stateAmbientLight: stateAmbientLight_1.stateAmbientLight,
    getDimmerVoltage: getDimmerVoltage_1.getDimmerVoltage,
    stateDimmerVoltage: stateDimmerVoltage_1.stateDimmerVoltage,
    getColorZone: getColorZone_1.getColorZone,
    setColorZone: setColorZone_1.setColorZone,
    stateZone: stateColorZone_1.stateZone,
    getCountZone: getCountZone_1.getCountZone,
    stateCountZone: stateCountZone_1.stateCountZone,
    stateMultiZone: stateColorMultiZone_1.stateMultiZone,
    getDeviceChain: getDeviceChain_1.getDeviceChain,
    getTileState64: getTileState64_1.getTileState64,
    setTileState64: setTileState64_1.setTileState64,
    setUserPosition: setUserPosition_1.setUserPosition,
    stateDeviceChain: stateDeviceChain_1.stateDeviceChain,
    stateTileState64: stateTileState64_1.stateTileState64,
    updateWanInfo: updateWanInfo_1.updateWanInfo
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYWNrZXRzL3BhY2tldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxxREFBa0Q7QUFDbEQseURBQXNEO0FBQ3RELDRDQUF5QztBQUN6Qyw0Q0FBeUM7QUFDekMsZ0RBQTZDO0FBQzdDLGlFQUFtRTtBQUNuRSxxRUFBa0U7QUFDbEUsMkRBQXdEO0FBQ3hELDJEQUF3RDtBQUN4RCwrREFBNEQ7QUFDNUQsd0RBQXFEO0FBQ3JELDREQUF5RDtBQUN6RCxvRUFBaUU7QUFDakUsd0VBQXFFO0FBQ3JFLHdEQUFxRDtBQUNyRCw0REFBeUQ7QUFDekQsb0VBQWlFO0FBQ2pFLHdFQUFxRTtBQUNyRSwrQ0FBNEM7QUFDNUMsK0NBQTRDO0FBQzVDLG1EQUFnRDtBQUNoRCwyQ0FBd0M7QUFDeEMsMkNBQXdDO0FBQ3hDLCtDQUE0QztBQUM1QywwREFBdUQ7QUFDdkQsMERBQXVEO0FBQ3ZELDhEQUEyRDtBQUMzRCwrQ0FBNEM7QUFDNUMsK0NBQTRDO0FBQzVDLG1EQUFnRDtBQUNoRCwyREFBd0Q7QUFDeEQsMkRBQXdEO0FBQ3hELCtEQUE0RDtBQUM1RCxxRUFBMEQ7QUFDMUQseUVBQThEO0FBQzlELDRDQUF5QztBQUN6QyxnREFBNkM7QUFDN0MsMEVBQXVFO0FBQ3ZFLDhFQUEyRTtBQUMzRSw0Q0FBeUM7QUFDekMseUZBQXNGO0FBQ3RGLDZGQUEwRjtBQUMxRiw4REFBMkQ7QUFDM0Qsb0RBQWlEO0FBQ2pELHNEQUFtRDtBQUNuRCx3REFBcUQ7QUFDckQsNERBQXlEO0FBQ3pELCtDQUE0QztBQUM1QywrQ0FBNEM7QUFDNUMsbURBQWdEO0FBQ2hELCtDQUE0QztBQUM1QywrQ0FBNEM7QUFDNUMsbURBQWdEO0FBRWhEOztHQUVHO0FBQ0gsOERBQXNEO0FBQ3RELGtFQUEwRDtBQUMxRCwrQ0FBNEM7QUFDNUMsd0RBQXFEO0FBQ3JELHdFQUFxRTtBQUNyRSw0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
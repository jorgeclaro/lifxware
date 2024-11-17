export var Interface;
(function (Interface) {
    Interface[Interface["SOFT_AP"] = 1] = "SOFT_AP";
    Interface[Interface["STATION"] = 2] = "STATION";
})(Interface || (Interface = {}));
export var SecurityProtocol;
(function (SecurityProtocol) {
    SecurityProtocol[SecurityProtocol["OPEN"] = 1] = "OPEN";
    SecurityProtocol[SecurityProtocol["WEP_PSK"] = 2] = "WEP_PSK";
    SecurityProtocol[SecurityProtocol["WPA_TKIP_PSK"] = 3] = "WPA_TKIP_PSK";
    SecurityProtocol[SecurityProtocol["WPA_AES_PSK"] = 4] = "WPA_AES_PSK";
    SecurityProtocol[SecurityProtocol["WPA2_AES_PSK"] = 5] = "WPA2_AES_PSK";
    SecurityProtocol[SecurityProtocol["WPA2_TKIP_PSK"] = 6] = "WPA2_TKIP_PSK";
    SecurityProtocol[SecurityProtocol["WPA2_MIXED_PSK"] = 7] = "WPA2_MIXED_PSK";
})(SecurityProtocol || (SecurityProtocol = {}));
export var WIFI_STATUS;
(function (WIFI_STATUS) {
    WIFI_STATUS[WIFI_STATUS["CONNECTING"] = 0] = "CONNECTING";
    WIFI_STATUS[WIFI_STATUS["CONNECTED"] = 1] = "CONNECTED";
    WIFI_STATUS[WIFI_STATUS["FAILED"] = 2] = "FAILED";
    WIFI_STATUS[WIFI_STATUS["OFF"] = 3] = "OFF";
})(WIFI_STATUS || (WIFI_STATUS = {}));
//# sourceMappingURL=wifi.js.map
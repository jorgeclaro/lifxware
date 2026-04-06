export declare enum ButtonGesture {
    PRESS = 1,
    HOLD = 2,
    PRESS_PRESS = 3,
    PRESS_HOLD = 4,
    HOLD_HOLD = 5,
    PRESS_RELEASE = 6,
    HOLD_RELEASE = 7,
    PRESS_TOUCH = 8,
    HOLD_TOUCH = 9,
    PRESS_TOUCH_REPEAT = 10,
    HOLD_TOUCH_REPEAT = 11,
    PRESS_FAST_REPEAT = 12
}
export declare enum ButtonTargetType {
    RESERVED_0 = 0,
    RESERVED_1 = 1,
    POWER_TOGGLE_RELAYS = 2,
    POWER_TOGGLE_DEVICE = 3,
    POWER_TOGGLE_LOCATION = 4,
    POWER_TOGGLE_GROUP = 5,
    SCENE = 6,
    POWER_TOGGLE_DEVICE_RELAYS = 7,
    BRIGHTNESS_DOWN_DEVICE = 8,
    BRIGHTNESS_DOWN_GROUP = 9,
    BRIGHTNESS_DOWN_LOCATION = 10,
    BRIGHTNESS_UP_DEVICE = 11,
    BRIGHTNESS_UP_GROUP = 12,
    BRIGHTNESS_UP_LOCATION = 13,
    DEMO_EFFECT_CYCLE = 14,
    DEMO_EFFECT_CYCLE_STOP = 15,
    DEMO_SUNRISE_SUNSET = 16,
    POWER_ON_DEVICE = 17,
    POWER_ON_LOCATION = 18,
    POWER_ON_GROUP = 19,
    POWER_ON_RELAYS = 20,
    POWER_OFF_DEVICE = 21,
    POWER_OFF_LOCATION = 22,
    POWER_OFF_GROUP = 23,
    POWER_OFF_RELAYS = 24,
    RESERVED_25 = 25,
    RESERVED_26 = 26,
    RESERVED_27 = 27,
    POWER_TOGGLE_LOCAL_DEVICE = 28,
    BRIGHTNESS_DOWN_LOCAL_DEVICE = 29,
    BRIGHTNESS_UP_LOCAL_DEVICE = 30
}
export interface ButtonTargetRelays {
    relaysCount: number;
    relays: number[];
}
export interface ButtonTargetDevice {
    serial: Buffer;
}
export interface ButtonTargetDeviceRelays {
    serial: Buffer;
    relaysCount: number;
    relays: number[];
}
export type ButtonTarget = Buffer;
export interface ButtonAction {
    gesture: ButtonGesture;
    targetType: ButtonTargetType;
    target: ButtonTarget;
}
export interface Button {
    actionsCount: number;
    actions: ButtonAction[];
}
export interface ButtonBacklightHsbk {
    hue: number;
    saturation: number;
    brightness: number;
    kelvin: number;
}
export interface ButtonConfig {
    hapticDurationMs: number;
    backlightOnColor: ButtonBacklightHsbk;
    backlightOffColor: ButtonBacklightHsbk;
}
export interface ButtonState {
    count: number;
    index: number;
    buttonsCount: number;
    buttons: Button[];
}
//# sourceMappingURL=button.d.ts.map
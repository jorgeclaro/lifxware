"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./lib/logger");
const client_1 = require("./client");
const waveform_1 = require("./packets/waveform/waveform");
const Table = require("cli-table");
const inquirer = require('inquirer');
const client = new client_1.Client({ debug: false });
client.on(client_1.ClientEvents.LISTENING, () => __awaiter(void 0, void 0, void 0, function* () {
    const address = client.getAddress();
    logger_1.logger.info('Started LIFX listening on ' + address.address + ':' + address.port);
    yield mainMenu();
}));
client.on(client_1.ClientEvents.ERROR, (err) => {
    logger_1.logger.error(err);
    client.destroy();
});
function printLights() {
    console.info(logger_1.colors.blue('Lights:'));
    const lights = client.lights();
    const table = new Table({
        head: ['Id', 'Label', 'Address', 'Port', 'Legacy', 'Connectivity'],
        colWidths: [20, 20, 20, 15, 15, 15]
    });
    for (const light of lights) {
        table.push([
            light.id,
            light.label,
            light.address,
            light.port,
            light.legacy ? 'true' : 'false',
            light.connectivity ? 'online' : 'offline'
        ]);
    }
    console.info(table.toString());
}
function printLightsState(lights) {
    return __awaiter(this, void 0, void 0, function* () {
        console.info(logger_1.colors.blue('Lights state:'));
        for (const light of lights) {
            yield light.getState();
        }
        const table = new Table({
            head: ['Id', 'Connectivity', 'Power', 'Color'],
            colWidths: [20, 15, 15, 70]
        });
        for (const light of lights) {
            table.push([light.id, light.connectivity, light.power ? 'on' : 'off', JSON.stringify(light.color)]);
        }
        console.info(table.toString());
    });
}
function lightsMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const lights = client.lights();
        const lightIds = [];
        for (const light of lights) {
            lightIds.push(light.id);
        }
        lightIds.push('All');
        const lightsPrompt = {
            type: 'list',
            name: 'lightId',
            message: 'What light?',
            choices: lightIds
        };
        const lightAnswer = yield inquirer.prompt(lightsPrompt);
        if (lightAnswer.lightId === 'All') {
            return client.lights();
        }
        const light = client.light(lightAnswer.lightId);
        return [light];
    });
}
function powerMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const powerPrompt = {
            type: 'list',
            name: 'power',
            message: 'What power?',
            choices: ['on', 'off']
        };
        const powerAnswer = yield inquirer.prompt(powerPrompt);
        return powerAnswer.power === 'on';
    });
}
function colorMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const questions = [
            {
                type: 'number',
                name: 'hue',
                message: 'hue?',
                default: 0
            },
            {
                type: 'number',
                name: 'saturation',
                message: 'saturation?',
                default: 50
            },
            {
                type: 'number',
                name: 'brightness',
                message: 'brightness?',
                default: 50
            },
            {
                type: 'number',
                name: 'kelvin',
                message: 'kelvin?',
                default: 3500
            }
        ];
        const answers = yield inquirer.prompt(questions);
        return answers;
    });
}
function waveformMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const questions = [
            {
                type: 'boolean',
                name: 'isTransient',
                message: 'Is Transient?',
                default: false
            },
            {
                type: 'number',
                name: 'hue',
                message: 'hue?',
                default: 0
            },
            {
                type: 'number',
                name: 'saturation',
                message: 'saturation?',
                default: 0
            },
            {
                type: 'number',
                name: 'brightness',
                message: 'brightness?',
                default: 100
            },
            {
                type: 'number',
                name: 'kelvin',
                message: 'kelvin?',
                default: 3500
            },
            {
                type: 'number',
                name: 'period',
                message: 'Period?',
                default: 1000
            },
            {
                type: 'number',
                name: 'cycles',
                message: 'Cycles?',
                default: 3
            },
            {
                type: 'number',
                name: 'skewRatio',
                message: 'Skew Ratio?',
                default: 0
            },
            {
                type: 'list',
                name: 'waveform',
                message: 'Waveform?',
                choices: ['SAW', 'SINE', 'HALF_SINE', 'TRIANGLE', 'PULSE']
            }
        ];
        const answers = yield inquirer.prompt(questions);
        let waveformType;
        switch (answers.waveform) {
            case 'SAW':
                waveformType = waveform_1.WaveformType.SAW;
                break;
            case 'SINE':
                waveformType = waveform_1.WaveformType.SINE;
                break;
            case 'HALF_SINE':
                waveformType = waveform_1.WaveformType.HALF_SINE;
                break;
            case 'TRIANGLE':
                waveformType = waveform_1.WaveformType.TRIANGLE;
            case 'PULSE':
                waveformType = waveform_1.WaveformType.PULSE;
            default:
                break;
        }
        const waveform = {
            isTransient: answers.isTransient,
            color: {
                hue: answers.hue,
                saturation: answers.saturation,
                brightness: answers.brightness,
                kelvin: answers.kelvin
            },
            period: answers.period,
            cycles: answers.cycles,
            skewRatio: answers.skewRatio,
            waveform: waveformType
        };
        return waveform;
    });
}
const mainMenuPrompt = {
    type: 'list',
    name: 'client',
    message: 'What to do?',
    choices: ['GetLightList', 'GetLightState', 'SetLightPower', 'SetLightColor', 'SetWaveform', 'Exit']
};
// eslint-disable-next-line complexity
function mainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const answers = yield inquirer.prompt(mainMenuPrompt);
        switch (answers.client) {
            case 'GetLightList':
                printLights();
                mainMenu();
                break;
            case 'GetLightState':
                try {
                    const lights = yield lightsMenu();
                    yield printLightsState(lights);
                }
                catch (err) {
                    logger_1.logger.error(err);
                }
                mainMenu();
                break;
            case 'SetLightPower':
                try {
                    const lights = yield lightsMenu();
                    const power = yield powerMenu();
                    for (const light of lights) {
                        yield light.setPower(power);
                    }
                }
                catch (err) {
                    logger_1.logger.error(err);
                }
                mainMenu();
                break;
            case 'SetLightColor':
                try {
                    const lights = yield lightsMenu();
                    const color = yield colorMenu();
                    for (const light of lights) {
                        yield light.setColor(color.hue, color.saturation, color.brightness, color.kelvin);
                    }
                }
                catch (err) {
                    logger_1.logger.error(err);
                }
                mainMenu();
                break;
            case 'SetWaveform':
                const lights = yield lightsMenu();
                const waveform = yield waveformMenu();
                for (const light of lights) {
                    yield light.setWaveform(waveform);
                }
                mainMenu();
                break;
            case 'Exit':
                process.exit(0);
                break;
            default:
                console.error('Unknown option');
                mainMenu();
        }
    });
}
function errorHandler(err) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.error(err);
    });
}
process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHlDQUE4QztBQUM5QyxxQ0FBZ0Q7QUFFaEQsMERBQTRFO0FBRTVFLG1DQUFvQztBQUNwQyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFckMsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUU1QyxNQUFNLENBQUMsRUFBRSxDQUFDLHFCQUFZLENBQUMsU0FBUyxFQUFFLEdBQVMsRUFBRTtJQUM1QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFcEMsZUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxPQUFPLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakYsTUFBTSxRQUFRLEVBQUUsQ0FBQztBQUNsQixDQUFDLENBQUEsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQkFBWSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQVUsRUFBRSxFQUFFO0lBQzVDLGVBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxXQUFXO0lBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRXJDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMvQixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQztRQUN2QixJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFN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
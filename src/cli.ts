import { logger, colors } from './lib/logger';
import { Client, ClientEvents } from './client';
import { Light } from './light';
import { WaveformType, WaveformRequest } from './packets/waveform/waveform';
import { ServiceError } from './lib/error';
import Table = require('cli-table');
const inquirer = require('inquirer');

const client = new Client({ debug: false });

client.on(ClientEvents.LISTENING, async () => {
	const address = client.getAddress();

	logger.info('Started LIFX listening on ' + address.address + ':' + address.port);
	await mainMenu();
});

client.on(ClientEvents.ERROR, (err: Error) => {
	logger.error(err);
	client.destroy();
});

function printLights() {
	console.info(colors.blue('Lights:'));

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

async function printLightsState(lights: Light[]) {
	console.info(colors.blue('Lights state:'));

	for (const light of lights) {
		await light.getState();
	}

	const table = new Table({
		head: ['Id', 'Connectivity', 'Power', 'Color'],
		colWidths: [20, 15, 15, 70]
	});

	for (const light of lights) {
		table.push([light.id, light.connectivity, light.power ? 'on' : 'off', JSON.stringify(light.color)]);
	}

	console.info(table.toString());
}

async function lightsMenu() {
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

	const lightAnswer = await inquirer.prompt(lightsPrompt);

	if (lightAnswer.lightId === 'All') {
		return client.lights();
	}

	const light = client.light(lightAnswer.lightId);

	return [light];
}

async function powerMenu() {
	const powerPrompt = {
		type: 'list',
		name: 'power',
		message: 'What power?',
		choices: ['on', 'off']
	};

	const powerAnswer = await inquirer.prompt(powerPrompt);

	return powerAnswer.power === 'on';
}

async function colorMenu() {
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

	const answers = await inquirer.prompt(questions);

	return answers;
}

async function waveformMenu() {
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

	const answers = await inquirer.prompt(questions);

	let waveformType: WaveformType;

	switch (answers.waveform) {
		case 'SAW':
			waveformType = WaveformType.SAW;
			break;
		case 'SINE':
			waveformType = WaveformType.SINE;
			break;
		case 'HALF_SINE':
			waveformType = WaveformType.HALF_SINE;
			break;
		case 'TRIANGLE':
			waveformType = WaveformType.TRIANGLE;
		case 'PULSE':
			waveformType = WaveformType.PULSE;
		default:
			break;
	}

	const waveform: WaveformRequest = {
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
}

const mainMenuPrompt = {
	type: 'list',
	name: 'client',
	message: 'What to do?',
	choices: ['GetLightList', 'GetLightState', 'SetLightPower', 'SetLightColor', 'SetWaveform', 'Exit']
};

// eslint-disable-next-line complexity
async function mainMenu() {
	const answers = await inquirer.prompt(mainMenuPrompt);

	switch (answers.client) {
		case 'GetLightList':
			printLights();
			mainMenu();
			break;
		case 'GetLightState':
			try {
				const lights = await lightsMenu();

				await printLightsState(lights);
			} catch (err) {
				logger.error(err);
			}

			mainMenu();
			break;
		case 'SetLightPower':
			try {
				const lights = await lightsMenu();
				const power = await powerMenu();

				for (const light of lights) {
					await light.setPower(power);
				}
			} catch (err) {
				logger.error(err);
			}

			mainMenu();
			break;
		case 'SetLightColor':
			try {
				const lights = await lightsMenu();
				const color = await colorMenu();

				for (const light of lights) {
					await light.setColor(color.hue, color.saturation, color.brightness, color.kelvin);
				}
			} catch (err) {
				logger.error(err);
			}

			mainMenu();
			break;
		case 'SetWaveform':
			const lights = await lightsMenu();
			const waveform = await waveformMenu();

			for (const light of lights) {
				await light.setWaveform(waveform);
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
}

async function errorHandler(err: ServiceError) {
	logger.error(err);
}

process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);

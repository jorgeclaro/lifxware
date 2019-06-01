export const logger = console;

export const colors = {
	darkGray: function darkGray(txt: string) {
		return `\x1b[30m${txt}\x1b[0m`;
	},
	red: function red(txt: string) {
		return `\x1b[31m${txt}\x1b[0m`;
	},
	green: function green(txt: string) {
		return `\x1b[32m${txt}\x1b[0m`;
	},

	blue: function blue(txt: string) {
		return `\x1b[34m${txt}\x1b[0m`;
	},

	cyan: function cyan(txt: string) {
		return `\x1b[36m${txt}\x1b[0m`;
	},

	gray: function gray(txt: string) {
		return `\x1b[97m${txt}\x1b[0m`;
	},

	bold: function bold(txt: string) {
		return `\x1b[1m${txt}\x1b[0m`;
	}
};

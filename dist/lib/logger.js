export const logger = console;
export const colors = {
    darkGray: function darkGray(txt) {
        return `\x1b[30m${txt}\x1b[0m`;
    },
    red: function red(txt) {
        return `\x1b[31m${txt}\x1b[0m`;
    },
    green: function green(txt) {
        return `\x1b[32m${txt}\x1b[0m`;
    },
    blue: function blue(txt) {
        return `\x1b[34m${txt}\x1b[0m`;
    },
    cyan: function cyan(txt) {
        return `\x1b[36m${txt}\x1b[0m`;
    },
    gray: function gray(txt) {
        return `\x1b[97m${txt}\x1b[0m`;
    },
    bold: function bold(txt) {
        return `\x1b[1m${txt}\x1b[0m`;
    }
};
//# sourceMappingURL=logger.js.map
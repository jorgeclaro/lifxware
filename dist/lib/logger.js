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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUU5QixNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUc7SUFDckIsUUFBUSxFQUFFLFNBQVMsUUFBUSxDQUFDLEdBQVc7UUFDdEMsT0FBTyxXQUFXLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFDRCxHQUFHLEVBQUUsU0FBUyxHQUFHLENBQUMsR0FBVztRQUM1QixPQUFPLFdBQVcsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNELEtBQUssRUFBRSxTQUFTLEtBQUssQ0FBQyxHQUFXO1FBQ2hDLE9BQU8sV0FBVyxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBSSxFQUFFLFNBQVMsSUFBSSxDQUFDLEdBQVc7UUFDOUIsT0FBTyxXQUFXLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLEVBQUUsU0FBUyxJQUFJLENBQUMsR0FBVztRQUM5QixPQUFPLFdBQVcsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksRUFBRSxTQUFTLElBQUksQ0FBQyxHQUFXO1FBQzlCLE9BQU8sV0FBVyxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBSSxFQUFFLFNBQVMsSUFBSSxDQUFDLEdBQVc7UUFDOUIsT0FBTyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7Q0FDRCxDQUFDIn0=
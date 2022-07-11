export class Logger {
    constructor(public name = "", public verbose = 3) {}

    public debug = this.log;
    public log(...msg: unknown[]) {
        this.verbose >= 3 &&
            console.log(
                "\x1b[94m[LOG]\x1b[m" + (this.name ? ` \x1b[95m[${this.name}]\x1b[m` : ""),
                ...msg,
            );
    }

    public error(...msg: unknown[]) {
        this.verbose >= 1 &&
            console.log(
                "\x1b[91m[ERROR]\x1b[m" + (this.name ? ` \x1b[95m[${this.name}]\x1b[m` : ""),
                ...msg,
            );
    }

    public warn(...msg: unknown[]) {
        this.verbose >= 2 &&
            console.log(
                "\x1b[93m[WARN]\x1b[m" + (this.name ? ` \x1b[95m[${this.name}]\x1b[m` : ""),
                ...msg,
            );
    }

    public info(...msg: unknown[]) {
        this.verbose >= 3 &&
            console.log(
                "\x1b[96m[INFO]\x1b[m" + (this.name ? ` \x1b[95m[${this.name}]\x1b[m` : ""),
                ...msg,
            );
    }

    public success(...msg: unknown[]) {
        this.verbose >= 2 &&
            console.log(
                "\x1b[92m[SUCCESS]\x1b[m" + (this.name ? ` \x1b[95m[${this.name}]\x1b[m` : ""),
                ...msg,
            );
    }
}

export default Logger;

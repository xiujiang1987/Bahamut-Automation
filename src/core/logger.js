class Logger {
    space = 0;
    prefix = "";

    constructor(space = 0) {
        this.space = space;
        this.prefix = " ".repeat(space);
    }

    next() {
        return new Logger(this.space + 2);
    }

    log(...msg) {
        console.log(this.prefix, "\u001b[94m" + "[LOG]" + "\u001b[m", ...msg);
    }

    error(...msg) {
        console.log(this.prefix, "\u001b[91m" + "[ERROR]" + "\u001b[m", ...msg);
    }

    warn(...msg) {
        console.log(this.prefix, "\u001b[93m" + "[WARN]" + "\u001b[m", ...msg);
    }

    info(...msg) {
        console.log(this.prefix, "\u001b[96m" + "[INFO]" + "\u001b[m", ...msg);
    }

    debug(...msg) {
        console.log(this.prefix, "\u001b[95m" + "[DEBUG]" + "\u001b[m", ...msg);
    }
}

module.exports = Logger;

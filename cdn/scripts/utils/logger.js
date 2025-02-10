export const LOG_LEVELS = {
    FATAL: 0,
    ERROR: 10,
    WARN: 20,
    INFO: 30,
    DEBUG: 40,
}

export const LOG = {
    logLevel: LOG_LEVELS.ERROR, 
    fatal: (msg) => {
        if (this.logLevel >= LOG_LEVELS.FATAL) {
            console.error(msg);
        }
    },
    error: (msg) => {
        if (this.logLevel >= LOG_LEVELS.ERROR) {
            console.error(msg);
        }
    },
    warn: (msg) => {
        if (this.logLevel >= LOG_LEVELS.WARN) {
            console.error(msg);
        }
    },
    info: (msg) => {
        if (this.logLevel >= LOG_LEVELS.INFO) {
            console.log(msg);
        }
    },
    debug: (msg) => {
        if (this.logLevel >= LOG_LEVELS.DEBUG) {
            console.log(msg);
        }
    },
}

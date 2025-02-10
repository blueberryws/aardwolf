export const LOG_LEVELS = {
    FATAL: 0,
    ERROR: 10,
    WARN: 20,
    INFO: 30,
    DEBUG: 40,
}

export const LOG = {
    fatal: (msg) => {
        if (window.LOG_LEVEL >= LOG_LEVELS.FATAL) {
            console.error(msg);
        }
    },
    error: (msg) => {
        if (window.LOG_LEVEL >= LOG_LEVELS.ERROR) {
            console.error(msg);
        }
    },
    warn: (msg) => {
        if (window.LOG_LEVEL >= LOG_LEVELS.WARN) {
            console.error(msg);
        }
    },
    info: (msg) => {
        if (window.LOG_LEVEL >= LOG_LEVELS.INFO) {
            console.log(msg);
        }
    },
    debug: (msg) => {
        if (window.LOG_LEVEL >= LOG_LEVELS.DEBUG) {
            console.log(msg);
        }
    },
}

if (window.LOG_LEVEL == null) {
    window.LOG_LEVEL = LOG_LEVELS.ERROR;
}

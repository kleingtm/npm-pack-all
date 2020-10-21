module.exports.CliError = class CliError extends Error {
    constructor(flag, value, message) {
        super();

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CliError);
        }

        this.name = `CliInputError`;
        this.cliFlag = flag;
        this.cliValue = value;
        this.message = message;
    }
};

module.exports.safetyDecorator = function(wrapped) {
    return function() {
        try {
            wrapped.apply(this, arguments);
        } catch (e) {
            if (e.message.toLowerCase().includes(`no such file`)) return;
            throw e;
        }
    };
};

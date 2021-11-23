const { sentry_capture_exception } = require("./sentry");
const Logger = require("./logger");

const top_level_error_logger = new Logger();

function catch_fatal(err) {
    sentry_capture_exception(err);
    top_level_error_logger.error("> \u001b[91mFATAL ERROR\u001b[m >", err);
    process.exit(1);
}

function catch_error(err) {
    top_level_error_logger.error("> \u001b[91mERROR\u001b[m >", err);
    sentry_capture_exception(err);
}

module.exports = { catch_fatal, catch_error };

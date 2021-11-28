exports.parameters = [
    {
        name: "test_parameter",
        required: false,
    },
];

exports.run = async ({ params, outputs, logger }) => {
    const log = (...args) => logger.log("\u001b[95m[測試]\u001b[m", ...args);
    const error = (...args) => logger.error("\u001b[95m[測試]\u001b[m", ...args);
    const warn = (...args) => logger.warn("\u001b[95m[測試]\u001b[m", ...args);
    const info = (...args) => logger.info("\u001b[95m[測試]\u001b[m", ...args);

    log("LOG");
    error("ERROR");
    warn("WARN");
    info("INFO");

    info("params", params);
    info("outputs", outputs);

    return {
        report: "TEST REPORT",
    };
};

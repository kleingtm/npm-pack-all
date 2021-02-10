const defaultResult = {
    stderr: ``,
    stdout: ``,
    code: 0
};

module.exports.mockShellFn = function(fnName, result = defaultResult) {
    return jest.fn(function() {
        return result;
    });
};

/*
 * no flags -- should pass and name the artifact with pj name and
 * --output <nothing> --dev-deps (should fail due to output. check message)
 * */
const path = require(`path`);

const TEST_SUITE = `npm-pack-all: ${__filename}`;
const { CliError /*, safetyDecorator, shellExecDecorator*/ } = require(path.join(__dirname, `../utils.index`));

beforeEach(() => {
    jest.resetModules();
});

afterEach(() => {
    jest.restoreAllMocks();
});

afterAll(() => {
    console.info(`Success: ${TEST_SUITE}`);
});

describe(TEST_SUITE, () => {
    test("Test CliError", () => {
        const flag = `--output`;
        const flagValue = `artifact.tgz`;
        const message = `The \`--output\` flag requires a string filename`;

        const Error = new CliError(flag, flagValue, message);

        expect(Error.name).toEqual(`CliInputError`);
        expect(Error.cliFlag).toEqual(flag);
        expect(Error.cliValue).toEqual(flagValue);
        expect(Error.message).toEqual(message);
        expect(Error.stack).toBeDefined();
    });
});

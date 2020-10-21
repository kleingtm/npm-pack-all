const path = require(`path`);

const TEST_SUITE = `npm-pack-all: ${__filename}`;
const { CliError, safetyDecorator } = require(path.join(__dirname, `../utils.index`));

beforeAll(() => {
    console.error = jest.fn();
});

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
    test("Can throw proper cli input error, CliError", () => {
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

    test("Can use safetyDecorator to NOT exception if cp/mv files don't exist", () => {
        const MSG_NOT_TO_ERROR_ON = `no such file`;

        // don't throw on `no such file`
        expect(
            safetyDecorator(() => {
                throw new Error(MSG_NOT_TO_ERROR_ON);
            })
        ).not.toThrow();

        // error otherwise
        expect(
            safetyDecorator(() => {
                throw new Error();
            })
        ).toThrow();
    });
});

/*
 * no flags -- should pass and name the artifact with pj name and
 * --output <nothing> --dev-deps (should fail due to output. check message)
 * */

const minimist = require(`minimist`);
const fs = require(`fs`);
const path = require(`path`);

const TEST_SUITE = `npm-pack-all: ${__filename}`;

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
    test("Can run script without flags", () => {
        const mockArg = minimist(``.split(` `));

        //  mock input arguments
        jest.mock(`minimist`, () => {
            return jest.fn(() => mockArg);
        });

        // call script
        require(`../index`);

        const packageJson = require(path.join(process.cwd(), `package.json`));
        expect(fs.existsSync(`${packageJson.name}-${packageJson.version}.tgz`)).toBeTruthy();
    });
});

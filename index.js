#! /usr/bin/env node
const fs = require(`fs`);
const path = require(`path`);
const shell = require(`shelljs`);

const { CliError, safetyDecorator, shellExecDecorator } = require(path.join(__dirname, `./utils/utils.index`));

const cp = safetyDecorator(shell.cp);
const mv = safetyDecorator(shell.mv);
const exec = shellExecDecorator(shell.exec);

const FILES_TO_BACKUP = [`package.json`, `package-lock.json`, `yarn.lock`, `.npmignore`];
const TMP_DIRECTORY = path.join(process.cwd(), `.npm-pack-all-tmp`);

console.info(`
.------..------..------..------..------..------..------..------..------..------..------..------.
|N.--. ||P.--. ||M.--. ||-.--. ||P.--. ||A.--. ||C.--. ||K.--. ||-.--. ||A.--. ||L.--. ||L.--. |
| :(): || :/\\: || (\\/) || (\\/) || :/\\: || (\\/) || :/\\: || :/\\: || (\\/) || (\\/) || :/\\: || :/\\: |
| ()() || (__) || :\\/: || :\\/: || (__) || :\\/: || :\\/: || :\\/: || :\\/: || :\\/: || (__) || (__) |
| '--'N|| '--'P|| '--'M|| '--'-|| '--'P|| '--'A|| '--'C|| '--'K|| '--'-|| '--'A|| '--'L|| '--'L|
\`------'\`------'\`------'\`------'\`------'\`------'\`------'\`------'\`------'\`------'\`------'\`------'\n`);

// parse cli args
const cliArgs = require(`minimist`)(process.argv.slice(2));
if (typeof cliArgs.output !== `string` && cliArgs.output) {
    throw new CliError(`--output`, cliArgs.output, `The \`--output\` flag requires a string filename`);
}

const packageJson = require(path.join(process.cwd(), `package.json`));

shell.config.fatal = true; // error out if a shell command errors out
shell.config.silent = true;

// create temp directory
createTempDirectory(TMP_DIRECTORY);

// copy existing package.json and lock files (keep linting, etc in tact)
console.info(`Saving existing package.json and lock files`);
copyFiles(process.cwd(), TMP_DIRECTORY, FILES_TO_BACKUP);

setBundledDependencies(packageJson);

// pack with npm
console.info(`\nPacking source code${!cliArgs[`dev-deps`] ? `` : `, development`} and production dependencies...`);
exec(`npm -dd pack`, { silent: false, timeout: cliArgs.timeout || 3 * 60 * 1000 }); // 3 min timeout

// restoring package.json and lock files back to project root
console.info(`Restoring original package.json and lock files`);
moveFiles(TMP_DIRECTORY, process.cwd(), FILES_TO_BACKUP);
shell.rm(`-Rf`, TMP_DIRECTORY);
shell.rm(`-Rf`, `.npmignore`);

setArtifactName(cliArgs);

function createTempDirectory(dir) {
    shell.rm(`-Rf`, dir);
    shell.mkdir("-p", dir);
}

function setBundledDependencies(pj) {
    // prune - get rid of devDependencies
    pj.bundledDependencies = Object.keys(pj.dependencies);
    if (cliArgs[`dev-deps`]) {
        console.info(`Detected --dev-deps\n\nInstalling all modules...`);
        console.warn(`To save time and space, you may want to think about only packaging production dependencies`);
        pj.bundledDependencies = pj.bundledDependencies.concat(Object.keys(pj.devDependencies));
    }

    // put dependencies into bundledDependencies in package.json
    console.info(`Adding dependencies${cliArgs["dev-deps"] ? " and devDependencies" : ""} to bundledDependencies:`);
    console.info(JSON.stringify(pj.bundledDependencies, null, 4));
    fs.writeFileSync(path.join(process.cwd(), `package.json`), JSON.stringify(pj, null, 4));
}

function setArtifactName(args) {
    if (args.output) {
        shell.mv(
            `-f`,
            path.join(process.cwd(), `${packageJson.name}-${packageJson.version}.tgz`),
            path.join(process.cwd(), cliArgs.output)
        );
    }
}

function copyFiles(from, to, files) {
    files.forEach(file => {
        cp(`-Rf`, path.join(from, file), path.join(to, file));
    });
    shell.touch(`.npmignore`);
}

function moveFiles(from, to, files) {
    files.forEach(file => {
        mv(`-f`, path.join(from, file), path.join(to, file));
    });
}

const fs = require(`fs`);
const path = require(`path`);
const shell = require(`shelljs`);

const { CliError, safetyDecorator, shellExecDecorator } = require(path.join(__dirname, `./utils/utils.index`));

const cp = safetyDecorator(shell.cp);
const mv = safetyDecorator(shell.mv);
const exec = shellExecDecorator(shell.exec);

const packageManager = determinePackageManager();

const FILES_TO_BACKUP = [`package.json`, `package-lock.json`, `yarn.lock`];
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

// set bundledDependencies in package.json
const CMDs = {
    prune: {
        npm: `npm prune --production && npm install --production`, // removes dev deps
        yarn: `yarn install --production` // prunes automatically
    },
    install: {
        npm: `npm install --force`,
        yarn: `yarn install --force`
    }
};

setBundledDependencies(packageJson, CMDs, packageManager);

// pack with npm
console.info(`\nPacking source code${!cliArgs[`dev-deps`] ? `` : `, development`} and production dependencies...`);
exec(`npm -dd pack`, { silent: false, timeout: cliArgs.timeout || 3 * 60 * 1000 }); // 3 min timeout

// restoring package.json and lock files back to project root
console.info(`Restoring original package.json and lock files`);
moveFiles(TMP_DIRECTORY, process.cwd(), FILES_TO_BACKUP);
shell.rm(`-Rf`, TMP_DIRECTORY);

setArtifactName(cliArgs);

// re-install full dependency tree
console.info(`Restoring original node_modules tree:\n${CMDs.install[packageManager]}`);
exec(CMDs.install[packageManager]);

function createTempDirectory(dir) {
    shell.rm(`-Rf`, dir);
    shell.mkdir("-p", dir);
}

function determinePackageManager() {
    const yarnLockExists = fs.existsSync(path.join(process.cwd(), `yarn.lock`));
    const npmLockExists = fs.existsSync(path.join(process.cwd(), `package-lock.json`));

    // if only yarn.lock exists, convert yarn.lock to package-lock.json (we'll use npm)
    let result = `npm`;
    if (yarnLockExists && !npmLockExists) {
        result = `yarn`;
    }
    return result;
}

function setBundledDependencies(pj, cmds, packageManager) {
    // prune - get rid of devDependencies
    pj.bundledDependencies = Object.keys(pj.dependencies);
    if (!cliArgs[`dev-deps`]) {
        console.info(`Pruning node_modules for packing production dependencies only...`);
        exec(cmds.prune[packageManager]); // cmd based on package manager. based on existing lockfile. npm takes precedence if both exist
    } else {
        console.info(`Detected --dev-deps\n\nInstalling all modules...`);
        console.warn(`To save time and space, you may want to think about only packaging production dependencies`);
        exec(cmds.install[packageManager]); // cmd based on package manager. based on existing lockfile. npm takes precedence if both exist
        pj.bundledDependencies = pj.bundledDependencies.concat(Object.keys(pj.devDependencies));
    }

    // put dependencies into bundledDependencies in package.json
    console.info(`Adding dependencies${cliArgs["dev-deps"] ? " and devDependencies" : ""} to bundledDependencies`);
    fs.writeFileSync(path.join(process.cwd(), `package.json`), JSON.stringify(packageJson, null, 4));
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
}

function moveFiles(from, to, files) {
    files.forEach(file => {
        mv(`-f`, path.join(from, file), path.join(to, file));
    });
}

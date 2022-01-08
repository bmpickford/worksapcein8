import { execSync } from 'child_process';
import { GetCommands } from './commands/index.js';
import chalk from 'chalk';


/**
 * Package manager base class
 */
export class PackageManager {
    static cwd = './';
    static instance = undefined;
    static manager = undefined;
    static run(manager) {
        if (manager !== PackageManager.manager || PackageManager.instance === undefined) {
            PackageManager.instance = new PackageManager(PackageManager.cwd, manager);
        }
        return PackageManager.instance
    }

    /**
     * 
     * @param {string} cwd  - Working directory to perform the commands in
     * @param {execSync} exec - Exec function
     * @param {string} manager - npm, yarn or pnpm
     */
    constructor(cwd, manager, exec = execSync) {
        this.cwd = cwd;
        this.commands = GetCommands(manager);
        this.exec = (command) => {
            if (PackageManager.debug) console.debug(`${chalk.yellow('running:')} ${command}`);
            try {
                const response = exec(command, { cwd: this.cwd });
                if (PackageManager.debug) console.debug(chalk.yellow(response));
                return response;
            } catch (error) {
                console.error(chalk.red(` --- --- ---`))
                console.error(chalk.red(`${error.status, error.message}`))
                console.error(chalk.red(error.stderr.toString()))
                console.error(chalk.red(error.stdout.toString()))
                console.error(chalk.red(` --- --- ---`))
                throw new Error(`Executing ${manager} command "${command}" failed at ${process.env.PWD}/${this.cwd} - ${error.message}`);
            }
        }
        this.install();
        if (manager == 'yarn2') {
            this.exec('yarn set version latest')
        }
    }

    /**
     * Runs install
     */
    install() {
        return this.exec(this.commands.install());
    }


    /**
     * Adds dependency
     * 
     * @param  {...string} pkgs - Packages to install 
     */
    add(pkgs) {
        return this.exec(this.commands.add(pkgs));
    }


    /**
     * Adds dev dependency
     * 
     * @param  {...string} pkgs - Packages to install 
     */
    addDev(pkgs) {
        return this.exec(this.commands.addDev(pkgs));
    }

    /**
     * Runs init
     */
    init(cmd, opts) {
        return this.exec(this.commands.init(cmd, opts));
    }

    /**
     * Runs a command
     */
    run(cmd) {
        return this.exec(this.commands.run(cmd));
    }

    workspaces = {
        run(cmd) {
            return this.exec(this.commands.workspaces.run(cmd));
        }
    }
}

export * as Commands from './commands/index.js';

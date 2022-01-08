export const NPMCommands = {
    install: () => 'npm install',
    add: (...pkgs) => `npm i ${pkgs.join(' ')}`,
    addDev: (...pkgs) => `npm i ${pkgs.join(' ')} --save-dev`,
    init: (cmd, opts) => `npm init ${cmd} -- ${opts}`,
    run: (cmd) => `npm run ${cmd}`,
    workspaces: {
        run: (cmd) => `npm run ${cmd} --ws`,
    },
}

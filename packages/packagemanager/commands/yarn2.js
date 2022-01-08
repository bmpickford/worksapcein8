export const Yarn2Commands = {
    install: () => 'yarn install',
    add: (...pkgs) => `yarn add ${pkgs.join(' ')}`,
    addDev: (...pkgs) => `yarn add ${pkgs.join(' ')} -D`,
    init: (cmd, opts) => `yarn create ${cmd} ${opts}`,
    run: (cmd) => `yarn run ${cmd}`,
    workspaces: {
        run: (cmd) => `yarn workspaces foreach run ${cmd}`,
    },
}
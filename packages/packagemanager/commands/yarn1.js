export const Yarn1Commands = {
    install: () => 'yarn install',
    add: (...pkgs) => `yarn add ${pkgs.join(' ')} -W`,
    addDev: (...pkgs) => `yarn add ${pkgs.join(' ')} -D -W`,
    init: (cmd, opts) => `yarn create ${cmd} ${opts}`,
    run: (cmd) => `yarn run ${cmd}`,
    workspaces: {
        run: (cmd) => `yarn workspaces foreach run ${cmd}`,
    },
}
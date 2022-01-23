export const PNPMCommands = {
  install: () => 'pnpm install',
  add: (...pkgs) => `pnpm add ${pkgs.join(' ')}`,
  addDev: (...pkgs) => `pnpm add ${pkgs.join(' ')} -D`,
  init: (cmd, opts) => `pnpm create ${cmd} -- ${opts}`,
  run: (cmd) => `pnpm ${cmd}`,
  workspaces: {
    run: (cmd) => `pnpm -r ${cmd}`,
  },
};

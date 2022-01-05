import { NPMCommands } from './npm.js';
import { Yarn1Commands } from './yarn1.js';
import { Yarn2Commands } from './yarn2.js';
import { PNPMCommands } from './pnpm.js';

const GetCommands = (manager = 'npm') => {
    switch(manager.toLowerCase()){
    case 'yarn':
    case 'yarn_classic':
        return Yarn1Commands;
    case 'yarn2':
    case 'yarn3':
    case 'yarn_berry':
        return Yarn2Commands;
    case 'pnpm':
        return PNPMCommands;
    default:
        return NPMCommands;
    }
}

export {
    GetCommands,
    NPMCommands,
    Yarn1Commands,
    Yarn2Commands,
    PNPMCommands,
}
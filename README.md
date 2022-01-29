# @workspacein8

> Configurable workspace generator for monorepos with premade templates for node and UI component libraries

## Key Features

 * Supports npm, yarn and pnpm
 * Node or UI libraries based on templates
 * Supprts HTML, React and Lit
 * Typescript and Typedoc as optional includes

## Usage
```bash
# Interactive prompts for creating your workspace
npx @workspacein8/init my_new_workspace

# Generate a component library
npx @workspacein8/init my_new_workspace --template components

# Generate a component library with a specific framework
npx @workspacein8/init my_new_workspace --template components --framework react
```

## Example Outputs
[Examples](https://github.com/bmpickford/worksapcein8/tree/main/examples)

## CLI Options
```bash
Options:
      --version    Show version number            [boolean]
      --debug      Add debugging statements       [boolean]
  -y               Preselect all defaults         [boolean]
  -t, --template   Use premade template           [choices: "node", "components"] [default: "node"]
  -f, --framework  Use specific framework         [choices: "none", "react"] [default: "none"]
  -h, --help       Show help                      [boolean]
```
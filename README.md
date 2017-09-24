# Installation Instructions
Ensure you have the following dev dependencies installed:
```console
npm install -D import-sort-cli import-sort-parser-babylon
npm install -D github:ferdaber/import-sort-style-gw
```

Set up your `package.json` file to have the following top-level property:
```json
"importSort": {
    ".js, .jsx, .es6, .es": {
      "parser": "babylon",
      "style": "gw"
    }
}
```

# Usage
Run this command:
```console
node_modules/.bin/import-sort -o [filename | directory]
```
Or set up an npm script to do so. The `-o` flag will overwrite the files in place, otherwise it will output the results into `stdout`.
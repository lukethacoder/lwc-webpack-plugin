# lwc-webpack-plugin

⚡ An opinionated Webpack plugin for LWC based on the official [`@salesforce/lwc-webpack-plugin`](https://github.com/salesforce/lwc-webpack-plugin).

This plugin allows you to use LWC within any web framework project that uses Webpack.

## Updates

A list of changes and additions to the official [`@salesforce/lwc-webpack-plugin`](https://github.com/salesforce/lwc-webpack-plugin) plugin.

- Adds support for namespaces and multi directory modules (as per [@lukethacoder/lwc-module-resolver](https://github.com/lukethacoder/lwc-module-resolver))
- Adds support for `rootDir`, instead of defaulting to `process.cwd()`

## Install

```
pnpm add -D @lukethacoder/lwc-webpack-plugin @lukethacoder/lwc-module-resolver lwc
```

Note that you must install your own dependencies for `lwc` and `@lukethacoder/lwc-module-resolver`.

## Usage

```javascript
const LwcWebpackPlugin = require('@lukethacoder/lwc-webpack-plugin')

module.exports = {
  plugins: [new LwcWebpackPlugin()]
}
```

The above example assumes that you have configured LWC modules via `lwc.config.json` in your project root, or as `lwc` key in your `package.json`.

Pass the `module` configuration as parameter to the plugin, if you prefer to not use any of the above mentioned LWC module configuration options.

```javascript
const LwcWebpackPlugin = require('@lukethacoder/lwc-webpack-plugin')

module.exports = {
  plugins: [
    new LwcWebpackPlugin({
      rootDir: './my-cool-project',
      modules: [
        {
          dirs: [
            './shared/main/default/lwc',
            './project1/main/default/lwc',
            './project2/main/default/lwc',
          ],
          namespace: 'c',
        },
        { npm: 'lwc-recipes-oss-ui-components' },
        { npm: 'lightning-base-components' }
      ]
    })
  ]
}
```

The plugin takes also three additional configuration options:

- `rootDir` - defaults to `process.cmd()`
- `stylesheetConfig`
- `outputConfig`

These options are 1:1 mappings of the LWC Compiler options, which are documented [here](https://github.com/salesforce/lwc/tree/master/packages/%40lwc/compiler#apis).

## LWC v`2.*.*`

Please use version `3.0.4` of this package if you need to support pre v3 versions of `lwc`
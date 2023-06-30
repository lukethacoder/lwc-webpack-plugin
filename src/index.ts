/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/* eslint-disable no-prototype-builtins */
import { resolve } from 'path'
import { Compiler } from 'webpack'
import { LwcModuleResolverPlugin } from './module-resolver'
import {
  AliasModuleRecord,
  DirModuleRecord,
  ModuleRecord,
  NpmModuleRecord,
} from '@lukethacoder/lwc-module-resolver'
import { existsSync, readFileSync } from 'fs'
import noderesolve from 'resolve'

interface PluginConfig {
  rootDir: string
  modules: any[]
  stylesheetConfig: any
  outputConfig: any
  experimentalDynamicComponent: any
}

const PACKAGE_JSON = 'package.json'

function transformModuleRecordsToIncludes(
  rootDir,
  modulesConfig: any[]
): string[] {
  let modules: ModuleRecord[] = []

  const pkgJson = JSON.parse(
    readFileSync(resolve(rootDir, 'package.json'), 'utf8')
  )
  if (pkgJson.lwc && pkgJson.lwc.modules && pkgJson.lwc.modules.length) {
    modules = pkgJson.lwc.modules
  }

  if (existsSync(resolve(rootDir, 'lwc.config.json'))) {
    const lwcConfig = JSON.parse(
      readFileSync(resolve(rootDir, 'lwc.config.json'), 'utf8')
    )
    if (lwcConfig.modules && lwcConfig.modules.length) {
      modules = lwcConfig.modules
    }
  }

  if (modulesConfig && modulesConfig.length) {
    modules = modulesConfig
  }

  const records = []
  for (const module of modules) {
    if (module.hasOwnProperty('npm')) {
      try {
        let resolved = noderesolve.sync((module as NpmModuleRecord).npm, {
          /* Use packageFilter in order to be able to 'resolve' packages
           * that may incorrectly not-specify the 'main' property, which is
           * required for a node module to be correctly detected.
           */
          packageFilter: (pkg) => {
            pkg.main = PACKAGE_JSON
            return pkg
          },
          basedir: rootDir,
        })
        resolved = resolved.slice(0, -PACKAGE_JSON.length)
        records.push(resolved)
      } catch (ignore) {
        // log errors
        console.log(ignore)
      }
    } else if (module.hasOwnProperty('dir')) {
      records.push(resolve(rootDir, (module as DirModuleRecord).dir))
    } else if (module.hasOwnProperty('dirs')) {
      ;(module as DirModuleRecord).dirs.forEach((singleDir) => {
        records.push(resolve(rootDir, singleDir))
      })
    } else if (module.hasOwnProperty('alias')) {
      records.push(resolve(rootDir, (module as AliasModuleRecord).path))
    }
  }

  return records
}

const EXTENSIONS = ['.js', '.ts']

module.exports = class Plugin {
  config: PluginConfig
  constructor(config: PluginConfig) {
    this.config = config
  }
  apply(compiler: Compiler) {
    const {
      rootDir = process.cwd(),
      modules = [],
      stylesheetConfig = {},
      outputConfig = {},
      experimentalDynamicComponent = {},
    } = this.config || {}
    compiler.hooks.environment.tap('lwc-webpack-plugin', () => {
      const resolverPlugin = new LwcModuleResolverPlugin(modules)

      compiler.options.resolve.plugins = [resolverPlugin]
      compiler.options.resolveLoader.plugins = [resolverPlugin]

      let rules = compiler.options.module.rules
      if (rules === undefined) {
        rules = compiler.options.module.rules = []
      }
    })

    let { alias } = compiler.options.resolve
    if (alias === undefined) {
      alias = compiler.options.resolve.alias = {}
    }

    // Specify known package aliases
    alias['lwc'] = require.resolve('@lwc/engine-dom')
    alias['wire-service'] = require.resolve('@lwc/wire-service')

    try {
      // the 'main' property for @lwc/synthetic-shadow refers to a file that
      // simply logs an error message. This needs to be fixed up to directly
      // specify the actual implementation, which lives under
      // /dist/synthetic-shadow.js. Note: this depends on the internal file
      // structure of this component, and there is a little fragile, if the
      // module ever changes where this implementation lives.
      alias['@lwc/synthetic-shadow'] = require.resolve(
        '@lwc/synthetic-shadow/dist/synthetic-shadow.js'
      )
    } catch (error) {
      // v3 LWC packages do not require the synthetic-shadow resolution
    }

    if (compiler.options.resolve.extensions) {
      compiler.options.resolve.extensions.push(...EXTENSIONS)
    } else {
      compiler.options.resolve.extensions = EXTENSIONS
    }

    compiler.options.module.rules.push({
      test: /\.(js|ts|html|css)$/,
      include: transformModuleRecordsToIncludes(rootDir, modules),
      use: {
        loader: require.resolve('./loader'),
        options: {
          stylesheetConfig,
          outputConfig,
          experimentalDynamicComponent,
        },
      },
    })
  }
}

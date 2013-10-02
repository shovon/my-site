importer = require 'importer'
async = require 'async'
fs = require 'fs'
path = require 'path'

module.exports = (env, callback) ->
  defaults =
    minify: false

  options = env.config.jsconcat or {}
  for key, value of defaults
    if defaults.hasOwnProperty key
      options[key] ?= defaults[key]

  class JSConcatPlugin extends env.ContentPlugin

    constructor: (@filepath, @source) ->

    getFilename: ->
      @filepath.relative

    getView: ->
      return (env, locals, contents, templates, callback) ->

        async.waterfall [
          (callback) =>
            pkg = importer.createPackage @filepath.full,
              sync: false

              minify: options.minify

            pkg.build (err, result) =>
              return callback err if err
              callback null, new Buffer result.code
        ], callback

  JSConcatPlugin.fromFile = (filepath, callback) ->
    fs.readFile filepath.full, (error, buffer) ->
      if error
        callback error
      else
        callback null, new JSConcatPlugin filepath, buffer.toString 'utf8'

  env.registerContentPlugin 'scripts', '**/*.js', JSConcatPlugin
  callback()
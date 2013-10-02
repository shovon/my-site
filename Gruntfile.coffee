child_process = require 'child_process'
async = require 'async'
fs = require 'fs'
mkdirp = require 'mkdirp'
request = require 'request'
rimraf = require 'rimraf'
path = require 'path'

module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    wintersmith:
      build:
        options:
          config: './config-production.json'
      preview:
        options:
          action: 'preview'


  grunt.registerTask 'get', 'Downlaod the dependencies', ->
    bowerJson = JSON.parse fs.readFileSync 'bower.json', 'utf8'
    done = @async()

    async.each(bowerJson.extraDependencies, ((dependency, callback) ->
      destDir = path.join(
        __dirname,
        'contents',
        'extra_dependencies',
        dependency.name
      )

      if dependency.files?
        return do ->
          mkdirp.sync destDir
          async.each(dependency.files, ((file, callback) ->
            request file.remote, (err, res, body) ->
              if res.statusCode >= 400
                err = new Error 'Some error occured'

              if err
                return callback err if err

              fs.writeFileSync (path.join destDir, file.filename), body, 'utf8'
              callback null
          ),
          (err) ->
            return callback err if err
            callback null
          )
      else if dependency.repo?
        return do ->
          # TODO: delete old repo before cloning.

          git = child_process.spawn 'git', [
            'clone'
            dependency.repo.url
            destDir
          ]

          onData = (data) ->
            console.log data.toString('utf8').trim()

          git.stdout.on 'data', onData
          git.stderr.on 'data', onData

          git.on 'close', (code) ->
            return callback new Error 'Weird error' if code
            # TODO: delete the .git folder before returning.
            callback null

      callback null
    ),
    (err) ->
      throw err if err
      done()
    )

  # If your tempted to refactor this code to use Grunt Wintersmith, then be my
  # guest. However, at the time of trying the aforementioned plugin, it didn't
  # work that well.
  #
  # So this is a heads up.

  runWintersmith = (args, done) ->
    whichWintersmith = './node_modules/wintersmith/bin/wintersmith'
    wintersmith = child_process.spawn whichWintersmith, args

    onData = (data) ->
      console.log data.toString('utf8').trim()

    wintersmith.stdout.on 'data', onData
    wintersmith.stderr.on 'data', onData
    wintersmith.on 'close', (code) ->
      throw new Error 'Something went wrong' if code

      done()

  grunt.registerTask 'preview', 'Preview the site', ->
    done = this.async()
    runWintersmith [
      'preview'
    ], done

  grunt.registerTask 'default', 'Build the entire site', ->
    done = this.async()
    runWintersmith [
      'build'
      '--config'
      './config-production.json'
    ], done
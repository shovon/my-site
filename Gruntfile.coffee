module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    wintersmith:
      build:
        options:
          action: 'build'
      preview:
        options:
          action: 'preview'

  grunt.loadNpmTasks 'grunt-wintersmith'

  grunt.registerTask 'preview', [ 'wintersmith:preview' ]
  grunt.registerTask 'default', [ 'wintersmith:build' ]
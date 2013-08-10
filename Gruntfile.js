/* jshint node: true */

"use strict";

var
child_process = require("child_process"),
async = require("async"),
path = require("path"),
express = require("express"),
chokidar = require("chokidar");

module.exports = function (grunt) {
  var
  pkg = grunt.file.readJSON("package.json"),
  stage = function () {
    grunt.file.recurse("src", function (abspath) {
      copy(abspath);
    });
  },
  copy = function (filename) {
    var
    source = path.resolve(process.cwd(), filename),
    dest   = (function () {
      var subdir = source.slice(path.resolve(process.cwd(), "src").length + 1);
      return path.resolve(process.cwd(), ".stage", subdir);
    }());
    // TODO: add preprocessing here.
    grunt.file.copy(source, dest);
  };

  grunt.initConfig({
    pkg: pkg
  });

  grunt.task.registerTask("stage", "Stage the site for production", function () {
    stage();
  });

  grunt.task.registerTask("default", "Runs a webserver", function () {
    var
    app,
    srcpath = "src",
    watcher = chokidar.watch(srcpath,  {persisten: true});

    this.async();

    stage();

    watcher
    .on("add", copy)
    .on("change", copy);

    app = express();

    app.use(express.errorHandler());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(app.router);
    app.use(express.static(".stage"));
    app.use(express.directory(".stage"));

    app.use(express.static(".stage"));

    app.listen(4000);
    console.log("Server listening on port 3000");
  });

  grunt.task.registerTask("publish", "Publish the project to the live site", function () {
    var
    done = this.async(),
    git,
    TEMP_PUBLISH_DIR = ".publish";

    grunt.file.delete(TEMP_PUBLISH_DIR);

    async.waterfall([
      function (callback) {
        git = child_process.spawn("git", [
          "clone",
          "https://github.com/shovon/shovon.github.io.git",
          TEMP_PUBLISH_DIR
        ]);
        console.log("Cloning.");
        git.on("close", function () {
          console.log("Cloned");
          callback(null);
        });
      }, function (callback) {
        git = child_process.spawn("git", [
          "rm", "-rf", "*"
        ], { cwd: ".publish" });

        git.on("close", function () {
          console.log("Cleared.");
          callback(null);
        });
      }, function (callback) {
        stage();
        process.nextTick(function () {
          callback(null);
        });
      }, function (callback) {
        grunt.file.recurse(".stage", function (abspath, rootdir, subdir, filename) {
          subdir = subdir || ".";
          grunt.file.copy(abspath, path.resolve(".publish", subdir, filename));
        });

        console.log("Copied.");

        process.nextTick(function () {
          callback(null);
        });
      }, function (callback) {
        git = child_process.spawn("git", ["add", "-A"], {
          cwd: ".publish"
        });
        git.on("close", function () {
          console.log("Staged.");
          callback(null);
        }, { cwd: ".publish" });
      }, function (callback) {
        git = child_process.spawn("git", ["commit", "-a", "-m", "Update."], {
          cwd: ".publish"
        });
        git.on("close", function () {
          console.log("Committed.");
          callback(null);
        });
      }, function (callback) {
        git = child_process.spawn("git", ["push", "origin", "master"], {
          cwd: ".publish"
        });
        git.on("close", function () {
          callback(null);
        });
      }
    ], function () {
      done();
    });
  });
};
/* jshint node: true */

"use strict";

var
child_process = require("child_process"),
async         = require("async"),
path          = require("path"),
express       = require("express"),
chokidar      = require("chokidar"),
less          = require("less");

// TODO: figure out a way to prevent crashes on LESS errors.

module.exports = function (grunt) {
  var
  pkg = grunt.file.readJSON("package.json"),
  processingExtensions = {
    ".css.less": function (src, callback) {
      src = src.toString("utf8");
      less.render(src, callback);
    }
  },
  stage = function (callback) {
    var files = [];
    callback = callback || function () {};
    grunt.file.recurse("src", function (abspath) {
      files.push(abspath);
    });
    async.each(files, copy, function () {
      callback(null);
    });
  },
  copy = function (filename, callback) {
    var
    source = path.resolve(process.cwd(), filename),
    dest   = (function () {
      var subdir = source.slice(path.resolve(process.cwd(), "src").length + 1);
      return path.resolve(process.cwd(), ".stage", subdir);
    }()),
    extensions = path.basename(source).split("."),
    code = grunt.file.read(source, { encoding: null }),
    finalPath = path.join(path.dirname(dest), extensions.join("."));

    callback = callback || function () {};

    async.whilst(function () { return extensions.length > 2; }, function (callback) {
      var
      extension  = extensions.pop(),
      processExt = "." + extensions[extensions.length - 1] + "." + extension;
      if (!processingExtensions[processExt]) {
        extensions.push(extension);
        finalPath = path.join(path.dirname(dest), extensions.join("."));
        extensions = [];
        return callback(null);
      }
      processingExtensions[processExt](code, function (err, src) {
        code = new Buffer(src);
        finalPath = path.join(path.dirname(dest), extensions.join("."));
        extensions = [];
        callback(err, code);
      });
    }, function () {
      grunt.file.mkdir(path.dirname(finalPath));
      grunt.file.write(finalPath, code);
      callback(null);
    });
  };

  grunt.initConfig({
    pkg: pkg
  });

  grunt.task.registerTask("stage", "Stage the site for production", function () {
    var done = this.async();
    stage(function () {
      done();
    });
  });

  grunt.task.registerTask("default", "Runs a webserver", function () {
    var
    app,
    srcpath = "src",
    watcher = chokidar.watch(srcpath,  {persisten: true});

    this.async();

    stage();

    // TODO: Have the watcher delete the files in `.stage` which have been
    //   deleted from source.
    watcher
    .on("add", function (path) {
      copy(path);
    })
    .on("change", function () {
      copy(path);
    });

    app = express();

    app.use(express.errorHandler());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(app.router);
    app.use(express.static(".stage"));
    app.use(express.directory(".stage"));

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
        stage(function () {
          console.log("Built.");
          callback(null);
        });
      }, function (callback) {
        grunt.file.recurse(".stage", function (abspath, rootdir, subdir, filename) {
          subdir = subdir || ".";
          grunt.file.copy(abspath, path.join(".publish", subdir, filename));
        });

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
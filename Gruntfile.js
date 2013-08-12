/* jshint node: true */

"use strict";

var
child_process = require("child_process"),
async         = require("async"),
path          = require("path"),
express       = require("express"),
chokidar      = require("chokidar"),
less          = require("less"),
CSON          = require("cson"),
_             = require("lodash");

// TODO: figure out a way to prevent crashes on LESS errors.
// TODO: unit test the code in here.

module.exports = function (grunt) {
  var
  pkg = grunt.file.readJSON("package.json"),

  /**
   * Parses the header CSON data. Note: the source code must be formatted in
   * human-readable string. Expects CSON to be wrapped in `---`, where the
   * the first substring in the source code must be a `---`.
   *
   * @returns { data, src } where data is the CSON data in the header, and
   *   src is the source code.
   */
  parseHeaderCSON = function (src) {
    var
    index = src.indexOf("---", 3),
    cson = src.slice(3, index),
    newSrc = src.slice(index + 3, src.length);
    return {
      data: CSON.parseSync(cson),
      src : newSrc
    };
  },

  /**
   * A key-value pair of all preprocessor extensions, and their respective
   * preprocessor callbacks.
   *
   * @param buffer a binary buffer
   * @param callback(err, result) where `err` is an error and `result` is a
   *   binary buffer.
   */
  processingExtensions = {
    /**
     * LESS to CSS
     */
    ".css.less": function (src, callback) {
      src = src.toString("utf8");
      less.render(src, function (err, result) {
        callback(err, new Buffer(result));
      });
    },

    /**
     * Underscore to HTML
     */
    ".html.ejs": function (src, callback) {
      var

      // The initial meta data is just an empty object and the original source
      // code.
      contentMeta = { data: {}, src: src },
      layoutMeta  = { data: {}, src: "<%= content %>" },

      data = {},
      compiledContent,
      compiledLayout;

      src = src.toString("utf8");

      // Get the data and the source code.
      if (/^---/.test(src)) {
        contentMeta = parseHeaderCSON(src);
      }

      // Get the data and source code for the layout, if a specific one was
      // requested.

      if (contentMeta.data.layout) {
        layoutMeta.src = grunt.file.read(
          path.join(
            "src",
            "_layouts",
            contentMeta.data.layout + ".html.ejs"
          )
        );

        if (/^---/.test(layoutMeta.src)) {
          layoutMeta = parseHeaderCSON(src);
        }
      }

      delete contentMeta.data.layout;
      delete layoutMeta.data.layout;

      data = contentMeta.data;
      data =  _.assign(data, layoutMeta.data);

      compiledContent = _.template(contentMeta.src, data);

      data.content = compiledContent;

      compiledLayout  = _.template(layoutMeta.src, data);

      process.nextTick(function () {
        callback(null, new Buffer(compiledLayout));
      });
    }
  },

  /**
   * Checks to see if a file or its ancestor directory have any underscores
   * prepended in its names.
   *
   * @param the filename to check
   *
   * @returns true if an underscore is found. False otherwise.
   */
  isPrivate = function (filename) {
    return !filename.split("/").every(function (item) {
      return item[0] !== "_";
    });
  },

  /**
   * Stages the source code to a temporary `.stage` folder.
   *
   * @param callback(err) where `err` is an error object.
   */
  stage = function (callback) {
    var files = [];
    callback = callback || function () {};
    grunt.file.recurse("src", function (abspath) {
      files.push(abspath);
    });
    async.each(files, copy, function (err) {
      callback(err);
    });
  },

  /**
   * "Copies" a file to the staging folder. It also applies any necessary
   * preprocessing.
   *
   * @param filename is always expected to be a path in `src` (i.e.
   * src/something/another good, /esoteric/elsewhere bad).
   */
  // TODO: find a better name for `copy`.
  copy = function (filename, callback) {
    var

    // The absolute path of the source and destination.
    source = path.resolve(process.cwd(), filename),
    dest   = (function () {
      var subdir = source.slice(path.resolve(process.cwd(), "src").length + 1);
      return path.resolve(process.cwd(), ".stage", subdir);
    }()),

    extensions = path.basename(source).split("."),

    // Grab the source code and binary data.
    code = grunt.file.read(source, { encoding: null }),
    finalPath = path.join(path.dirname(dest), extensions.join("."));

    callback = callback || function () {};

    if (isPrivate(filename)) return callback(null);

    async.whilst(
    function () { return extensions.length > 2; },
    function (callback) {
      var
      extension  = extensions.pop(),

      // Get the .<destination format>.<source format> extension to be matched
      // with the above `processingExtensions` key-value pairs (e.g.
      // .css.less).
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
    },
    function (err) {
      if (err) return callback(err);
      grunt.file.mkdir(path.dirname(finalPath));
      grunt.file.write(finalPath, code);
      callback(null);
    });
  };

  grunt.initConfig({
    pkg: pkg
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
    .on("change", function (path) {
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

  grunt.task.registerTask("stage", "Stage the site for production", function () {
    var done = this.async();
    stage(function (err) {
      if (err) throw err;
      done();
    });
  });

  grunt.task.registerTask("publish", "Publish the project to the live site", function () {
    var
    done = this.async(),
    git,
    TEMP_PUBLISH_DIR = ".publish";

    grunt.file.delete(TEMP_PUBLISH_DIR);

    async.waterfall([
      // `git clone <url>`
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
      },
      // `git rm -rf *`
      function (callback) {
        git = child_process.spawn("git", [
          "rm", "-rf", "*"
        ], { cwd: ".publish" });

        git.on("close", function () {
          console.log("Cleared.");
          callback(null);
        });
      },
      // The `stage` function.
      function (callback) {
        stage(function (err) {
          if (err) throw err;
          console.log("Built.");
          callback(null);
        });
      },
      // Copy all staged files to `.publish`.
      function (callback) {
        grunt.file.recurse(".stage", function (abspath, rootdir, subdir, filename) {
          subdir = subdir || ".";
          grunt.file.copy(abspath, path.join(".publish", subdir, filename));
        });

        process.nextTick(function () {
          callback(null);
        });
      },
      // `git add -A`
      function (callback) {
        git = child_process.spawn("git", ["add", "-A"], {
          cwd: ".publish"
        });
        git.on("close", function () {
          console.log("Staged.");
          callback(null);
        }, { cwd: ".publish" });
      },
      // `git commit -a -m "Update."
      function (callback) {
        git = child_process.spawn("git", ["commit", "-a", "-m", "Update."], {
          cwd: ".publish"
        });
        git.on("close", function () {
          console.log("Committed.");
          callback(null);
        });
      },
      // `git push origin master`
      function (callback) {
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
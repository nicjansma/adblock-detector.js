/*eslint-env node*/
/*eslint-disable camelcase*/
module.exports = function(grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            options: {},
            build: ["test/*.tap", "test/coverage"]
        },
        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> v<%= pkg.version %> */\n",
                mangle: true,
                sourceMap: true
            },
            build: {
                src: "src/<%= pkg.name %>.js",
                dest: "dist/<%= pkg.name %>.min.js"
            }
        },
        eslint: {
            console: {
                src: [
                    "*.js",
                    "src/**/*.js",
                    "test/*.js"
                ]
            },
            build: {
                options: {
                    "output-file": "eslint.xml",
                    "format": "jslint-xml",
                    "silent": true
                },
                src: [
                    "Gruntfile.js",
                    "src/**/*.js",
                    "test/*.js"
                ]
            }
        },
        mocha_phantomjs: {
            all: {
                options: {
                    urls: [
                        "http://localhost:4002/test/test-no-blocker.html"
                    ],
                    reporter: "tap",
                    output: "test/mocha.tap"
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 4002,
                    base: "."
                }
            }
        }
    });

    //
    // Plugins
    //
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-mocha-phantomjs");
    grunt.loadNpmTasks("gruntify-eslint");

    //
    // Tasks
    //
    grunt.registerTask("test", ["test:mocha"]);
    grunt.registerTask("test:mocha", ["connect", "mocha_phantomjs"]);

    grunt.registerTask("lint", ["eslint:console"]);
    grunt.registerTask("lint:build", ["eslint:build"]);

    grunt.registerTask("build", ["uglify"]);

    //
    // Task Groups
    //
    grunt.registerTask("default", ["lint", "build"]);
    grunt.registerTask("travis", ["test", "lint"]);
    grunt.registerTask("all", ["clean", "test", "lint:build", "build"]);
};

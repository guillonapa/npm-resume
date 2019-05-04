module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: ["*.js", "lib/*.js", "test/*.js"],
            options: {
                esnext: true
            }         
        },
        babel: {
            options: {
                presets: ["@babel/env"]
            },
            dist: {
                files: {
                    "index.js": "lib/index.js"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-babel");

    grunt.registerTask("default", ["jshint", "babel"]);
};
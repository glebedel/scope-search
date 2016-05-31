const srcPath = "src/";
const testsPath = "tests/";
const destUglyPath = "src/min/";
const docsPath = "docs/";
const sourceFile = "mod_Decorator.js"

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false,
            },
            my_target: {
                files: {
                    [`${destUglyPath}module-decorator.js`]: `${srcPath}${sourceFile}`
                }
            }
        },
        shell: {
            jsdoc: {
                command: `jsdoc ${srcPath}${sourceFile} -d ${docsPath}`
            }
        },
        watch: {
            files: [`${srcPath}${sourceFile}`, `${testsPath}/*.js`, 'Gruntfile.js'],
            tasks: ['connect', 'jasmine:decorator', 'uglify', 'shell:jsdoc']
        },
        jasmine: {
            decorator: {
                src: `${srcPath}*.js`,
                options: {
                    specs: `${testsPath}*test.js`,
                    outfile: `${testsPath}spec.html`,
                    stopOnFailure: true,
                    keepRunner: true,
                    traceFatal: true,
                    host: 'http://127.0.0.1:9001/',
                    //template: require('grunt-template-jasmine-requirejs')
                    vendor: [`${testsPath}modManager.js`]
                },
                timeout: 1000
            }
        },
        connect:{
            server:{
                options:{
                    hostname:'127.0.0.1',
                    port: 9001,
                    onCreateServer: function(server, connect, options){

                    }
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('default', ['connect', 'jasmine:decorator', 'uglify', 'shell:jsdoc']);
    grunt.registerTask('test', ['connect', 'jasmine:decorator']);
}

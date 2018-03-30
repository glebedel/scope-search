const srcPath = "src/";
const testsPath = "tests/";
const destUglyPath = "build/min/";
const destEs5Path = "build/es5/";
const docsPath = "docs/";
const sourceName = "search";
const sourceFile = `${sourceName}.js`;

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    jshint:{
        all:['Gruntfile.js', `${srcPath}*.js`, `${testsPath}*.js`],
        options:{
            esversion: 6
        }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
        plugins: ['transform-object-assign']
      },
      dist: {
        files: {
          [`${destEs5Path}${sourceFile}`]: `${srcPath}${sourceFile}`
        }
      }
    },
    uglify: {
      options: {
        mangle: false,
      },
      my_target: {
        files: {
          [`${destUglyPath}${sourceFile}`]: `${destEs5Path}${sourceFile}`
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
      tasks: ['default']
    },
    jasmine: {
      search: {
        src: `${destEs5Path}*.js`,
        options: {
          specs: `${testsPath}*test.js`,
          outfile: `${testsPath}spec.html`,
          stopOnFailure: true,
          keepRunner: true,
          traceFatal: true,
          host: 'http://127.0.0.1:9001/',
          polyfills: ['./node_modules/babel-polyfill/dist/polyfill.js']
          //template: require('grunt-template-jasmine-requirejs')
          //                    vendor: [`${testsPath}modManager.js`]
        },
        timeout: 1000
      }
    },
    connect: {
      server: {
        options: {
          hostname: '127.0.0.1',
          port: 9001,
          onCreateServer: function(server, connect, options) {

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
  grunt.registerTask('default', ['jshint', 'babel','connect', 'jasmine:search', 'uglify', 'shell:jsdoc']);
  grunt.registerTask('test', ['jshint', 'babel', 'connect', 'jasmine:search']);
};

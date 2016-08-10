module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-minify-html');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'src'
        },
        src: ['src/**/*.tpl.html'],
        dest: 'build/templates-app.js'
      }
    },
    less: {
      all: {
        src: 'style.less',
        dest: 'build/style.css',
        options: {
          report: 'gzip'
        }
      }
    },
    connect: {
      serve: {
        options: {
          port: 8080,
          base: 'build/',
          hostname: '*',
          debug: true
        }
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      templates: {
        files: ['src/**/*.tpl.html'],
        tasks: ['html2js']
      },
      less: {
        files: ['style.less', 'src/**/*.less'],
        tasks: ['less']
      },
      sources: {
        files: ['src/**/*.js', 'src/*.js', '!src/config.js'],
        tasks: ['concat_sourcemap:app', 'uglify:app']
      },
      index: {
        files: 'index.html',
        tasks: ['copy:index', 'minifyHtml']
      }
      // Useful for watching / rerunning karma tests
      // jsTest: {
      //    files: ['test/spec/{,*/}*.js'],
      //    tasks: ['karma']
      //}
    },
    concat_sourcemap: {
      options: {
        sourcesContent: true
      },
      app: {
        src: ['src/**/*.js', 'src/*.js', '!src/config.js'],
        dest: 'build/app.js'
      },
      libs: {
        src: [
          'libs/angular/angular.js',
          'libs/angular-animate/angular-animate.js',
          'libs/angular-touch/angular-touch.js',
          'libs/angular-bootstrap/ui-bootstrap.js',
          'libs/angular-mocks/angular-mocks.js',
          'libs/angular-ui-router/release/angular-ui-router.js',
          'libs/ng-table/dist/ng-table.js',
          'libs/satellizer/dist/satellizer.js'
        ],
        dest: 'build/libs.js'
      }
    },
    copy: {
      index: {
        src: 'index.html',
        dest: 'build/',
        options: {
          processContent: function (content, srcpath) {
            // Compiling index.html file!
            var packageVersion = require('./package.json').version;
            return grunt.template.process(content, {
              data: {
                version: packageVersion
              }
            });
          }
        }
      },
      robots: {
        src: 'src/robots.txt',
        dest: 'build/robots.txt'
      },
      config: {
        src: 'src/config.js',
        dest: 'build/config.js'
      },
      htaccess: {
        src: 'src/.htaccess',
        dest: 'build/.htaccess'
      }
    },
    clean: {
      all: {
        src: ['build/', '!build/config.js']
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      app: {
        files: {
          'build/app.min.js': ['build/app.js']
        }
      },
      libs: {
        files: {
          'build/libs.min.js': ['build/libs.js']
        }
      }
    },
    minifyHtml: {
        options: {
            cdata: true
        },
        dist: {
            files: {
                'build/index.html': 'build/index.html'
            }
        }
    },
    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });

  // Build process:
  // - clean build/
  // - creates build/templates-app.js from *.tpl.html files
  // - creates build/style.css from all the .less files
  // - concatenates all the source files in build/app.js - banner with git revision
  // - concatenates all the libraries in build/libs.js
  // - copies index.html over build/
  grunt.registerTask('build', ['clean', 'html2js', 'less', 'concat_sourcemap:app', 'concat_sourcemap:libs', 'uglify:app', 'uglify:libs', 'copy', 'minifyHtml']);
  grunt.registerTask('default', ['clean', 'concat_sourcemap:libs', 'uglify:libs', 'copy:config', 'connect', 'watch']);
  grunt.registerTask('test', ['karma']);
};

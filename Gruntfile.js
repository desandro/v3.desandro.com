
/*jshint node: true, strict: false*/

module.exports = function( grunt ) {

  var scripts = [
    'js/base.js',
    'js/sparkleshine.js',
    'js/charparticle.js',
    'js/typekit.js',
    'js/init.js'
  ];

  // add bower scripts
  var bowerScripts = [
    'bower_components/requestanimationframe/requestanimationframe.js'
  ];
  var concatScripts = bowerScripts
    .concat( scripts );

  grunt.initConfig({

    jshint: {
      site: scripts,
      options: grunt.file.readJSON('.jshintrc')
    },

    concat: {
      scripts: {
        // src will be set in package-sources task
        src: concatScripts,
        dest: 'build/js/scripts.js'
      }
    },

    uglify: {
      scripts: {
        src: concatScripts,
        dest: 'build/js/scripts.min.js'
      }
    },

    copy: {
      main: {
        src: [ 'style.css', 'img/*', 'js/*' ],
        dest: 'build/'
      },
      // TODO use Bower to get main files to copy over
      bowerScripts: {
        files: [
          {
            expand: true, // enable dynamic options
            src: [ '*/*.js' ],
            cwd: 'bower_components/', // set cwd, excludes it in build path
            dest: 'build/js/',
            flatten: true
          }
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // load all tasks in tasks/
  grunt.loadTasks('tasks/');

  grunt.registerTask( 'default', [
    'jshint',
    'uglify',
    'templating',
    'copy'
  ]);

};

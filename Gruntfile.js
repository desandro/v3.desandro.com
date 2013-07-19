
/*jshint node: true*/

module.exports = function( grunt ) {

  var scripts = [
    'js/base.js',
    'js/sparkleshine.js',
    'js/charparticle.js',
    'js/typekit.js',
    'js/init.js'
  ];

  // add bower scripts
  var concatScripts = [ 'bower_components/requestanimationframe/requestanimationframe.js' ]
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
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // load all tasks in tasks/
  grunt.loadTasks('tasks/');

};

var childProcess = require('child_process');
var fs = require('fs');

module.exports = function(grunt) {

  grunt.initConfig({

    // JS Hint
    lint: {
      files: [
        'js/base.js',
        'js/charparticle.js',
        'js/sparkleshine.js',
        'js/typekit.js',
        'js/init.js'
      ]
    },
    jshint: {
      options: {
        asi: false,
        curly: true,
        devel: false,
        eqeqeq: true,
        forin: false,
        newcap: true,
        noempty: true,
        strict: true,
        undef: true,
        browser: true
      },
      globals: {
        Modernizr: false,
        requestAnimationFrame: false,
        Typekit: false
      }
    }

  });


  var scriptFiles = [
    'js/base.js',
    'modules/requestanimationframe/requestanimationframe.js',
    'js/sparkleshine.js',
    'js/charparticle.js',
    'js/typekit.js',
    'js/init.js'
  ];



  function removeFile( patterns ) {
    var files = grunt.file.expandFiles( patterns );
    files.forEach( function( file ) {
      fs.unlinkSync( file );
    });
  }



  grunt.registerTask( 'buildjs', 'Minifies and concats JS', function( arg1 ) {
    removeFile('js/scripts-all*.js');
    var output = '';
    // timestamp destination js file
    var dest = 'js/scripts-all.' + grunt.template.today('yymmddhhmmss') + '.js';

    scriptFiles.forEach( function( fileSrc, i ) {
      var file = grunt.file.read( fileSrc );
      output  += '// ---- ' + fileSrc + ' ---- //\n\n';
      if ( arg1 === 'full' || fileSrc.indexOf('.min.js') !== -1 ) {
        // concat full file
        output += file;
      } else {
        // concat minified file
        output += grunt.helper( 'uglify', file );
      }
      output += '\n\n';
      grunt.file.write( dest, output );
    });
  });

  grunt.registerTask( 'js', function( arg1 ) {
    grunt.task.run( 'lint buildjs:' + ( arg1 || '') );
  });


  grunt.registerTask( 'scriptsrc', 'update <script src="">', function() {
    var script = grunt.file.expandFiles('js/scripts-all*.js')[0];
    var index = grunt.file.expandFiles('index.html')[0];
    var contents = grunt.file.read( index );
    var revised = contents.replace( /js\/scripts-all([\.\w\d\-]+)?.js/, script );
    grunt.file.write( index, revised );
  });

  // grunt version of `jekyll`
  grunt.registerTask( 'jekyll', 'Runs jekyll', function() {
    var done = this.async();
    grunt.utils.spawn({
      cmd: 'jekyll'
    }, function( err, result ) {
      grunt.log.write( result.cyan );
      done();
    });
  });

  // grunt version of `rm -rf _site`
  grunt.registerTask( 'removeSite', function() {
    var done = this.async();
    grunt.utils.spawn({
      cmd: 'rm',
      args: ['-rf', '_site']
    }, function() {
      done();
    });
  });

  grunt.registerTask( 'copyHtaccess', function() {
    grunt.file.copy( '.htaccess', '_site/.htaccess' );
  });

  grunt.registerTask( 'build', 'js scriptsrc removeSite jekyll copyHtaccess' );

};

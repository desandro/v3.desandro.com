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

  function twoDigit( num ) {
    return num < 10 ? '0' + num : num;
  }

  // returns YYYYMMDDHHMMSS
  function getTimestamp() {
    var now = new Date();
    return now.getFullYear() +
      twoDigit( now.getMonth() + 1 ) +
      twoDigit( now.getDate() ) +
      twoDigit( now.getHours() ) +
      twoDigit( now.getMinutes() ) +
      twoDigit( now.getSeconds() )
  }


  function removeFile( patterns ) {
    var files = grunt.file.expandFiles( patterns );
    files.forEach( function( file ) {
      fs.unlinkSync( file );
    });
  }


  grunt.registerTask( 'js', 'Minifies and concats JS', function( arg1 ) {
    removeFile('js/scripts-all*.js');
    var output = '';
    var dest = 'js/scripts-all.' + getTimestamp() + '.js';
    // console.log( this.file );
    scriptFiles.forEach( function( fileSrc, i ) {
      // console.log( fileSrc );
      var file = grunt.file.read( fileSrc );
      output  += '// ---- ' + fileSrc + ' ---- //\n\n';
      if ( arg1 === 'full' || fileSrc.indexOf('.min.js') !== -1 ) {
        console.log('full')
        output += file;
      } else {
        output += grunt.helper( 'uglify', file );
      }
      output += '\n\n';
      grunt.file.write( dest, output );
    });
  });

  grunt.registerTask( 'env', '', function() {
    var min = grunt.helper( 'uglify', 'var foo = 19; var bar = foo + 9;' )
    console.log( min )
  });

  // grunt.registerTask( 'scripts', 'concats and mins JS', function( arg1 ) {
  //
  //   console.log( arguments )
  //   grunt.log.writeln('hello world' + 'foo', isFull, arguments )
  // });



  grunt.registerTask( 'ls', 'deploy to server', function() {
    done = this.async();
    grunt.utils.spawn({
      cmd: 'ls',
      args: []
    }, function( err, result, code ) {
      console.log( result );
      done();
    })
  });

  grunt.registerTask( 'scriptsrc', 'update <script src="">', function() {
  });


  // grunt.registerTask( 'foo', 'Kicks up the foo-ness', function() {
  //   grunt.log.writeln('hello world')
  // });


};
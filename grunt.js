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
    },

    js: {
      files: [
        'js/base.js',
        'modules/requestanimationframe/requestanimationframe.js',
        'js/sparkleshine.js',
        'js/charparticle.js',
        'js/typekit.js',
        'js/init.js'
      ]
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


  grunt.registerTask( 'js', 'Minifies and concats JS', function( arg1 ) {
    // console.log( this.file );
    scriptFiles.forEach( function( fileSrc, i ) {
      // console.log( fileSrc );
      var file = grunt.file.read( fileSrc )
      console.log( grunt.helper( 'uglify', file ) )
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






  // grunt.registerTask( 'foo', 'Kicks up the foo-ness', function() {
  //   grunt.log.writeln('hello world')
  // });


};
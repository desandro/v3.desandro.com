/**
 * reads index.mustache and data.yml
 * to create build/index.html
**/

/*jshint node: true, strict: false */

var handlebars = require('handlebars');
var yaml = require('js-yaml');

module.exports = function( grunt ) {

  grunt.registerTask( 'templating', 'process templates', function() {
    var indexSrc = grunt.file.read('index.mustache');
    var template = handlebars.compile( indexSrc );

    var dataSrc = grunt.file.read('data.yml');
    var data = yaml.safeLoad( dataSrc );

    var rendered = template( data );
    grunt.file.write( 'build/index.html', rendered );
  });

};

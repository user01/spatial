
var typescriptPureOptions =
  {
    module: 'commonjs',
    target: 'es5',
    sourceMap: true,
    comments: true,
    declaration: true
  };

module.exports = function(grunt) {

require('load-grunt-tasks')(grunt);

grunt.initConfig({

  //*********************************
  //  Compile Typescript to ES
  //*********************************
  typescript: {
    tests: {
      src: [
        './tests/**/*.ts'
      ],
      dest: './built/',
      options: typescriptPureOptions
    },
    library: {
      src: ['./math/main.ts'],
      dest: './built/spatial.js',
      options: typescriptPureOptions
    }
  },

  //*********************************
  //  Empty out the built files
  //*********************************
  clean: {
    built: [
      "./built/"
    ],
    generated: [
      "./math/**/*.js",
      "./tests/**/*.js"
    ],
  },

  //*********************************
  //  Uglify the code
  //*********************************
  uglify: {
    all: {
      options: {
        beautify: false,
        mangle:true,
        sourceMapIn: 'dist/spatial.js.map',
        sourceMap: 'dist/spatial.min.js.map'
      },
      files: [{
          src: 'dist/spatial.js',
          dest: 'dist/spatial.min.js'
      }]
    },
  },


  //*********************************
  //  Mocha tests
  //*********************************
  simplemocha: {
    options: {
        globals: ['expect'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        //reporter: 'dot'
      },
      all: { src: ['./built/tests/**/*.js'] }
    },
});


grunt.registerTask('test', [
  'build',
  'typescript:tests',
  'simplemocha:all'
]);

grunt.registerTask('production', [
  'build',
  'uglify:all'
]);

grunt.registerTask('build', [
  'clean:built',
  'typescript:library'
]);



};

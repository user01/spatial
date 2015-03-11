
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
    build: {
      src: [
        './math/**/*.ts',
        './tests/**/*.ts'
      ],
      dest: './built/',
      options: typescriptPureOptions
    },
    all: {
      src: ['math/**/*.ts'],
      dest: './dist/spatial.js',
      options: typescriptPureOptions
    }
  },

  //*********************************
  //  Empty out the built files
  //*********************************
  clean: {
    build: [
      "./built/"
    ],
    dist: [
      "./dist/"
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
  'simplemocha:all'
]);

grunt.registerTask('dist', [
  'clean:dist',
  'typescript:all',
  'uglify:all'
]);

grunt.registerTask('build', [
  'clean:build',
  'typescript:build'
]);



};

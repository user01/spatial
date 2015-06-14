
function extend() {
  var newObj = {};
  for (var i = 0; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) {
          newObj[key] = arguments[i][key];
      }
    }
  }
  return newObj;
}

var buildDirectory = './build/';

var typescriptPureOptions =
  {
    module: 'commonjs',
    target: 'es5',
    sourceMap: true,
    comments: true,
    declaration: true
  };

var typescriptBrowserOptions =
  extend(typescriptPureOptions,
          { sourceMap: false });

var typescriptNodeOptions =
  extend(typescriptPureOptions,
          {
            declaration: false,
            comments: false
          });

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
      dest: buildDirectory + '/tests/run.js',
      options: typescriptPureOptions
    },
    node: {
      src: ['./math/main.ts'],
      dest: buildDirectory + 'spatial.node.js',
      options: typescriptNodeOptions
    },
    browser: {
      src: ['./math/references.ts'],
      dest: buildDirectory + 'spatial.browser.js',
      options: typescriptBrowserOptions
    }
  },

  //*********************************
  //  Empty out the built files
  //*********************************
  clean: {
    built: [
      buildDirectory
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
    browser: {
      options: {
        beautify: false,
        mangle:true,
      },
      files: [{
          src: buildDirectory + 'spatial.browser.js',
          dest: buildDirectory + 'spatial.min.js'
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
    all: { src: [buildDirectory + 'tests/**/*.js'] }
  },

  //*********************************
  //  Copy Operations
  //*********************************
  copy: {
    definition: {
      files: [
        {
          src: [buildDirectory + 'spatial.browser.d.ts'],
          dest: buildDirectory + 'spatial.d.ts',
        },
      ]
    },
  },

});


grunt.registerTask('test', [
  'typescript:tests',
  'simplemocha:all'
]);

grunt.registerTask('production', [
  'build',
  'uglify:browser'
]);

grunt.registerTask('build', [
  'clean:built',
  'typescript:node',
  'typescript:browser',
  'copy:definition'
]);



};

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', 'src/<%= pkg.name %>.js']
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          '<%= pkg.name %>.css': 'src//<%= pkg.name %>.scss'
        }
      }
    },

    watch: {
      css: {
        files: 'src/*.scss',
        tasks: ['sass']
      },

      js: {
        files: 'src/*.js',
        tasks: ['uglify']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'sass', 'watch']);

};

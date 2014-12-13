module.exports = function(grunt){
	'use strict';

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	// Project config
	grunt.initConfig({
		dirs: {
			src: 'src',
			dest: 'public'
		},
		jshint: {
			options: {
				jshintrc: true
			},
			target: {
				src: '<%= dirs.src %>/js/*.js'
			}
		},
		concat: {
			options: {
				separator: ';',
				sourceMap: true
			},
			target: {
				src: '<%= dirs.src %>/js/*.js',
				dest: '<%= dirs.dest %>/js/main.js'
			}
		},
		uglify: {
			options: {
				banner: '/* ! I am Ugly! */\n',
				compress: true,
				mangle: true,
				sourceMap: true
			},
			target: {
				src: '<%= dirs.dest %>/js/main.js',
				dest: '<%= dirs.dest %>/js/main.min.js'
			}
		},
		sass: {
			options: {
				outputStyle: 'compressed',
				sourceMap: true
			},
			target: {
				src: '<%= dirs.src %>/css/main.scss',
				dest: '<%= dirs.dest %>/css/main.min.css'
			}
		},
		clean: {
			all: '<%= dirs.dest %>',
			css: '<%= dirs.dest %>/css',
			js: '<%= dirs.dest %>/js'
		},
		watch: {
			options: {
				livereload: true
			},
			configs: {
				reload: true,
				files: ['Gruntfile.js', 'package.json']
			},
			targetJs: {
				files: ['<%= dirs.src %>/js/*.js'],
				tasks: ['build-js']
			},
			targetCss: {
				files: ['<%= dirs.src %>/css/**/*.scss'],
				tasks: ['build-css']
			},
			index: {
				files: ['index.html']
			}
		},
		connect: {
			server: {
				options: {
					port: 9003,
					target: 'http://localhost:9003',
					base: '.',
					livereload: true
				}
			}
		}
	});
	grunt.registerTask('build-js', ['clean:js', 'jshint', 'concat', 'uglify']);
	grunt.registerTask('build-css', ['clean:css', 'sass']);
	grunt.registerTask('build', ['clean:all', 'build-js', 'build-css']);

	// Default task(s)
	grunt.registerTask('default', ['build', 'connect', 'watch']);

};

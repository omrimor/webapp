module.exports = function(grunt){
	'use strict';

	// Display the elapsed execution time of grunt tasks
	require('time-grunt')(grunt);
	// Load all grunt-* packages from package.json
	require('load-grunt-tasks')(grunt);
	// Project config
	grunt.initConfig({
		// Read settings from package.json
		pkg: grunt.file.readJSON('package.json'),
		// Local server settings
		server: {
			port: 9003,
			liveReloadPort: 35731
		},
		// Paths settings
		dirs: {
			src: {
				src: 'src',
				css: 'src/css',
				js: 'src/js'
			},
			dest: {
				dest: 'public',
				css: 'public/css',
				js: 'public/js'
			}
		},
		// Check that all JS files conform to our `.jshintrc` files
		jshint: {
			options: {
				jshintrc: true
			},
			target: {
				src: '<%= dirs.src.js %>/**/*.js'
			}
		},
		// Combine all JS files into one compressed file (including sub-folders)
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> ' +
					'<%= grunt.template.today("dd-mm-yyyy") %> */\n',
				compress: true,
				mangle: true,
				sourceMap: true
			},
			target: {
				src: '<%= dirs.src.src %>/**/*.js',
				dest: '<%= dirs.dest.js %>/main.min.js'
			}
		},
		// Compile the main Sass file (that loads all other Sass files)
		// Output as one compressed file
		sass: {
			options: {
				outputStyle: 'compressed',
				sourceMap: true
			},
			target: {
				src: '<%= dirs.src.css %>/main.scss',
				dest: '<%= dirs.dest.css %>/main.min.css'
			}
		},
		// Cleanup setup, used before each build
		clean: {
			all: '<%= dirs.dest.dest %>',
			css: '<%= dirs.dest.css %>',
			js: '<%= dirs.dest.js %>'
		},
		// Trigger relevant tasks when the files they watch has been changed
		// This includes adding/deleting files/folders as well
		watch: {
			// Will try to connect to a LiveReload script
			options: {
				livereload: '<%= server.liveReloadPort %>'
			},
			configs: {
				reload: true,
				files: ['Gruntfile.js', 'package.json']
			},
			targetJs: {
				files: '<%= dirs.src.js %>/**/*.js',
				tasks: ['build-js']
			},
			targetCss: {
				files: '<%= dirs.src.css %>/**/*.scss',
				tasks: ['build-css']
			},
			index: {
				files: ['index.html']
			}
		},
		// Setup a local server (using Node) with LiveReload enabled
		connect: {
			server: {
				options: {
					port: '<%= server.port %>',
					hostname: 'localhost',
					target: 'http://localhost:<%= server.port %>',
					base: '.',
					livereload: '<%= server.liveReloadPort %>'
				}
			}
		}
	});
	grunt.registerTask('build-js', ['clean:js', 'jshint', 'uglify']);
	grunt.registerTask('build-css', ['clean:css', 'sass']);
	grunt.registerTask('build', ['clean:all', 'build-js', 'build-css']);

	// Default task(s)
	grunt.registerTask('default', ['build', 'connect', 'watch']);

};

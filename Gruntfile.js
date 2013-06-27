/*
 * grunt-gcc
 * https://github.com/Darsain/grunt-gcc
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
module.exports = function(grunt) {
	'use strict';

	var path = require('path');
	var tmpPath = path.join(__dirname, 'test', 'tmp');

	grunt.initConfig({
		meta: {
			banner: '/*! Example banner <%= grunt.template.today("dd-mmm-yyyy") %> */'
		},

		// Lint files.
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['tasks/*.js']
		},

		// Clean folders.
		clean: {
			dist: ['test/tmp/**', '!test/tmp']
		},

		// Minify files.
		gcc: {
			options: {
				banner: '<%= meta.banner %>'
			},
			dist: {
				options: {
					create_source_map: path.join(tmpPath, 'srcdest.min.js.map')
				},
				src: ['test/src/example.js', 'test/src/example1.js'],
				dest: 'test/tmp/srcdest.min.js'
			},
			files: {
				files: {
					'test/tmp/files.min.js': ['test/src/example.js', 'test/src/example1.js']
				}
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this plugin's task(s).
	grunt.registerTask('test', ['jshint', 'clean', 'gcc']);
	grunt.registerTask('default', ['test']);
};
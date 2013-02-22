/*
 * grunt-gcc
 * https://github.com/Darsain/grunt-gcc
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
'use strict';

module.exports = function(grunt) {
	var path = require('path');
	var tmpPath = path.join(__dirname, 'test', 'tmp');

	grunt.initConfig({
		meta: {
			banner: '/*! Example banner <%= grunt.template.today("dd-mmm-yyyy") %> */'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'tasks/*.js',
			],
		},
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

	// Custom cleaning task
	grunt.registerTask('clean', 'Clean stuff', function () {
		try {
			grunt.file.delete(tmpPath);
			grunt.file.mkdir(tmpPath);
			grunt.log.ok();
		} catch (error) {
			grunt.log.error();
			grunt.verbose.error(error);
			grunt.warn('Cleaning failed.');
		}
	});

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this plugin's task(s).
	grunt.registerTask('test', ['jshint', 'clean', 'gcc']);
	grunt.registerTask('default', ['test']);
};
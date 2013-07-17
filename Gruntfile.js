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
	var jsonFile = 'package.json';
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
			fls: {
				files: {
					'test/tmp/obj1.js': ['test/src/example.js', 'test/src/example1.js'],
					'test/tmp/obj2.js': ['test/src/example1.js', 'test/src/example.js']
				}
			},
			arr: {
				files: [
					{ src: ['test/src/example.js', 'test/src/example1.js'], dest: 'test/tmp/arr1.js' },
					{ src: ['test/src/example1.js', 'test/src/example.js'], dest: 'test/tmp/arr2.js' }
				]
			}
		},

		// Bump up fields in JSON files.
		bumpup: jsonFile,

		// Commit changes and tag the latest commit with a version from JSON file.
		tagrelease: jsonFile
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-tagrelease');
	grunt.loadNpmTasks('grunt-bumpup');

	// Task for updating the pkg config property. Needs to be run after
	// bumpup so the next tasks in queue can work with updated values.
	grunt.registerTask('updatePkg', function () {
		grunt.config.set('pkg', grunt.file.readJSON(jsonFile));
	});

	// Release task.
	grunt.registerTask('release', function (type) {
		type = type ? type : 'patch';
		grunt.task.run('jshint');
		grunt.task.run('bumpup:' + type);
		grunt.task.run('updatePkg');
		grunt.task.run('tagrelease');
	});

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this plugin's task(s).
	grunt.registerTask('test', ['jshint', 'clean', 'gcc']);
	grunt.registerTask('default', ['test']);
};
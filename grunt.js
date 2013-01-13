module.exports = function(grunt) {
	'use strict';

	var fs = require('fs'),
		jshintOptions = JSON.parse(fs.readFileSync('.jshintrc'));

	grunt.initConfig({
		meta: {
			banner: '/*! Example banner <%= grunt.template.today("dd-mmm-yyyy") %> */'
		},
		clean: {
			tmp: ['tmp']
		},
		jshint: {
			options: jshintOptions
		},
		lint: {
			files: ['tasks/gcc.js']
		},
		gcc: {
			dist: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: ['test/src/example.js', 'test/src/example1.js'],
				dest: 'test/tmp/example'+Math.round(Math.random()*999)+'.min.js'
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this plugin's task(s).
	grunt.registerTask('test', ['lint', 'clean', 'gcc']);
	grunt.registerTask('default', ['test']);
};
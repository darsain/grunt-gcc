/*
 * grunt-gcc
 * https://github.com/Darsain/grunt-gcc
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
module.exports = function(grunt) {
	'use strict';

	var compiler = require('gcc');

	grunt.registerMultiTask('gcc', 'Minify JavaScript files with Closure Compiler.', function () {
		var self = this,
			options = self.data.options,
			gccOptions = {},
			source = grunt.file.expandFiles(self.file.src),
			destination = self.file.dest,
			async = self.async(),
			max = grunt.helper('concat', source),
			min;

		if (typeof options === 'object') {
			Object.keys(options).forEach(function (key) {
				switch (key) {
					case 'banner':
						min = grunt.template.process(options.banner) + '\n';
						break;
					default:
						gccOptions[key] = options[key];
				}
			});
		}

		// Compile with Closure Compiler
		compiler.compile(source, gccOptions, function (error, stdout) {
			if (error) {
				grunt.warn(error);
				async();
				return;
			}

			min += stdout;
			grunt.file.write(destination, min);
			grunt.log.writeln('File `' + destination + '` created.');
			grunt.helper('min_max_info', min, max);

			// Task completed
			async();
		});
	});
};
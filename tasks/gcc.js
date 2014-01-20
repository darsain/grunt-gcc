/*
 * grunt-gcc
 * https://github.com/Darsain/grunt-gcc
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
module.exports = function(grunt) {
	'use strict';

	var contrib = require('grunt-lib-contrib').init(grunt);
	var compiler = require('gcc');

	grunt.registerMultiTask('gcc', 'Minify JavaScript files with Closure Compiler.', function () {

		var options = this.options();
		var done = this.async();
		var gccOptions = {};
		var banner = '';
		var report = false;
		var completed  = 0;

		// Parse options
		if (typeof options === 'object') {
			Object.keys(options).forEach(function (key) {
				switch (key) {
					case 'banner':
						if (options.banner) {
							banner = options.banner + '\n';
						}
						break;
					case 'report':
						report = options.report;
						break;
					default:
						gccOptions[key] = options[key];
				}
			});
		}

		// Iterate over all src-dest file pairs.
		this.files.forEach(function (f, i, files) {
			var result = banner;
			var source = f.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			});

			// Error handler
			function failed(error) {
				grunt.log.error();
				grunt.verbose.error(error);
				grunt.fail.warn('Closure Compiler failed.');
				done();
			}

			// Compile with Closure Compiler
			compiler.compile(source, gccOptions, function (error, stdout, stderr) {
				if (error) {
					failed(error);
					return;
				}
				if(stderr !== '' && gccOptions.warning_level !== 'QUIET') {//log gcc warnings
					grunt.log.warn(stderr);
				}
				completed++;

				result += stdout;
				grunt.file.write(f.dest, result);
				grunt.log.writeln('File `' + f.dest + '` created.');

				// Print min-max info
				if(report) {
					var preMinimize = source.reduce(function(contents, file) {
						return contents + grunt.file.read(file);
					}, "");
					contrib.minMaxInfo(result, preMinimize, options.report);
				}

				// File completed
				grunt.log.ok();

				// Trigger done on last file
				if (completed >= files.length) {
					done();
				}
			});
		});
	});
};
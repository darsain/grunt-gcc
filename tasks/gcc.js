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

		var options    = this.options();
		var done       = this.async();
		var gccOptions = {};
		var result     = '';

		// Parse options
		if (typeof options === 'object') {
			Object.keys(options).forEach(function (key) {
				switch (key) {
					case 'banner':
						if (options.banner) {
							result += options.banner + '\n';
						}
						break;
					default:
						gccOptions[key] = options[key];
				}
			});
		}

		// Iterate over all src-dest file pairs.
		this.files.forEach(function (f) {
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

			// Minify files, warn and fail on error.
			try {
				// Compile with Closure Compiler
				compiler.compile(source, gccOptions, function (error, stdout) {
					if (error) {
						failed(error);
						return;
					}

					result += stdout;
					grunt.file.write(f.dest, result);
					grunt.log.writeln('File `' + f.dest + '` created.');
					// Place min max info here, when there will be some standardized grunt lib for it

					// Task completed
					grunt.log.ok();
					done();
				});
			} catch (error) {
				failed(error);
			}
		});
	});
};
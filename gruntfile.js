module.exports = function (grunt)
{
	'use strict';

	/* config grunt */

	grunt.initConfig(
	{
		version: grunt.file.readJSON('vendor/redaxmedia/redaxscript/package.json').version,
		shell:
		{
			removeBuild:
			{
				command: 'rm -rf build'
			},
			getCommit:
			{
				command: 'cd vendor/redaxmedia/redaxscript && git rev-parse --short HEAD',
				options:
				{
					callback: function (error, stdout, stderr, done)
					{
						grunt.config.set('commit', stdout.trim());
						done();
					}
				}
			},
			options:
			{
				stdout: true,
				failOnError: true
			}
		},
		compress:
		{
			distFull:
			{
				src:
				[
					'assets/**',
					'cache/**',
					'database/**',
					'dist/**',
					'includes/**',
					'languages/**',
					'libraries/**',
					'modules/**',
					'templates/admin/**',
					'templates/console/**',
					'templates/default/**',
					'templates/install/**',
					'config.php',
					'console.php',
					'index.php',
					'install.php',
					'README.md',
					'.htaccess'
				],
				cwd: 'vendor/redaxmedia/redaxscript/',
				expand: true,
				dot: true,
				options:
				{
					archive: 'build/releases/redaxscript-<%= version %>-<%= commit %>-full.zip'
				}
			},
			distLite:
			{
				src:
				[
					'assets/**',
					'cache/**',
					'database/**',
					'dist/**',
					'includes/**',
					'languages/en.json',
					'libraries/**',
					'modules/CallHome/**',
					'modules/Validator/**',
					'templates/admin/**',
					'templates/console/**',
					'templates/default/**',
					'templates/install/**',
					'config.php',
					'console.php',
					'index.php',
					'install.php',
					'README.md',
					'.htaccess'
				],
				cwd: 'vendor/redaxmedia/redaxscript/',
				expand: true,
				dot: true,
				options:
				{
					archive: 'build/releases/redaxscript-<%= version %>-<%= commit %>-lite.zip'
				}
			}
		}
	});

	/* dynamic compress */

	grunt.dynamicCompress = function (cwd, path)
	{
		var directoryArray = grunt.file.expand(cwd + path),
			infoArray;

		for (var i in directoryArray)
		{
			infoArray = directoryArray[i].replace(cwd, '').split('.');
			grunt.config.set('compress.' + infoArray[0],
			{
				src:
				[
					infoArray[1] ? infoArray[0] + '.' + infoArray[1] : infoArray[0] + '/**'
				],
				cwd: cwd,
				expand: true,
				dot: true,
				options:
				{
					archive: 'build/' + infoArray[0] + '.zip'
				}
			});
		}
	};
	grunt.dynamicCompress('vendor/redaxmedia/redaxscript/', 'languages/*.json');
	grunt.dynamicCompress('vendor/redaxmedia/redaxscript/', 'modules/*');
	grunt.dynamicCompress('vendor/redaxmedia/redaxscript/', 'templates/default');
	grunt.dynamicCompress('vendor/redaxmedia/redaxscript/', 'templates/skeleton');
	grunt.dynamicCompress('vendor/redaxmedia/redaxscript/', 'templates/wide');

	/* load tasks */

	require('load-grunt-tasks')(grunt);

	/* register tasks */

	grunt.registerTask('default',
	[
		'shell:removeBuild',
		'shell:getCommit',
		'compress'
	]);
};

module.exports = function(grunt) {
	
	require('load-grunt-tasks')(grunt);
	
	grunt.initConfig({
		srcFile: 'src/',
		build: 'build/',
		testFile: 'tests/',
		//serverFolder: 'C:/Developppment/Web/Servers/pizi-express-server/Apps/pizi-chat/',
		serverFolder: 'C:/Users/e_na/Documents/GitHub/pizi-express-server/Apps/pizi-chat/',
		deployDev: ["**",
                "!css/sass/**",
                "!js/lib/*/**"],
		jsDevFiles: ["src/js/*.js",
                "src/js/views/*.js",
                "src/js/modules/*.js",
                "src/js/models/*.js"],
		sassDevFiles: "src/css/sass/*.scss",
		htmlDevFiles: ["src/index.html",
                "src/html/*.html"],
		jshint: {
			all: {
				options: {
					devel: true,
					esnext: true
				},
				src: '<%= jsDevFiles %>'
			}
		},
		sass: {
			options: {
				sourceMap: false	
			},
			all : {
				files: {
					'src/css/style.css': 'src/css/sass/main.scss'
				}
			}
		},
		copy: {
			deployDev : {
				files : [
					{
						expand: true,
						cwd: '<%= srcFile %>',
						src: '<%= deployDev %>',
						dest: '<%= serverFolder %>'
					},
					{
						'<%= serverFolder %>js/lib/modernizr/modernizr.js': 'src/js/lib/modernizr/modernizr.js'
					}
				]
			},
			deployDevBabel : {
				files : [
					{
						expand: true,
						cwd: '<%= build %>',
						src: ['**'],
						dest: '<%= serverFolder %>'
					},
					{
						expand: true,
						cwd: '<%= testFile %>',
						src: ['**'],
						dest: '<%= serverFolder %>'
					}
				]
			}
		},
		clean: {
			options: {
				force: true
			},
			deployDev: '<%= serverFolder %>',
			build: '<%= build %>',
			// Clean the css and less files copied with grunt-bower
      		bower: "<%= serverFolder %>/trash",
		},
		babel: {
			options: {
				sourceMap: false,
				"experimental": true,
        		"modules": "umd"
			},
			dist: {
				files: [{
					"expand": true,
					"cwd": '<%= srcFile %>',
					"src": ["**/*.js"],
					"dest": '<%= build %>',
					"ext": ".js"
				}]
			}
		},
		bower: {
			dev : {
				dest: '<%= serverFolder %>/trash',
				js_dest: '<%= serverFolder %>/js/lib',
				options: {
					expand: true
				}       
			}
		},
		watch: {
			sass : {
				files : "<%= sassDevFiles %>",
				tasks: ['sass']
			},
			css : {
				files : "src/css/style.css",
				tasks: ['copy:deployDev'],
				options: {
					spawn: false,
				}
			},
			js :{
				files : "<%= jsDevFiles %>",
				tasks: ['jshint', 'copy:deployDev'],
				options: {
					spawn: false,
				}
			},
			html:{
				files : "<%= htmlDevFiles %>",
				tasks: ['copy:deployDev'],
				options: {
					spawn: false,
				}
			}
		},
	});
	
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['jshint', 'clean:build', 'babel']);
	grunt.registerTask('deployDev', ['jshint', 'sass', 'clean:deployDev', 'copy:deployDev', 'bower', 'clean:bower']);
	grunt.registerTask('deployBuild', ['build', 'clean:deployDev', 'copy:deployDevBabel']);
};
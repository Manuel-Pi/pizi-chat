module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        srcFile: 'src/',
        build: 'build/',
        dist: 'dist/',
        testFile: 'tests/',
        serverFolder: '../../Servers/PiziServer/pizi-chat/',
        deployDev: ["**",
            "!css/sass/**",
            "!js/lib/*/**"
        ],
        jsDevFiles: ["src/js/*.js",
            "src/js/views/*.js",
            "src/js/modules/*.js",
            "src/js/models/*.js"
        ],
        sassDevFiles: "src/css/sass/*.scss",
        htmlDevFiles: ["src/index.html",
            "src/html/*.html"
        ],
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
                sourceMap: false,
                includePaths: [
                    'node_modules/foundation-sites/scss',
                    'node_modules/pizi-backbone/build'
                ]
            },
            all: {
                files: {
                    'dist/css/style.css': 'src/css/sass/main.scss'
                }
            }
        },
        copy: {
            deployDev: {
                files: [{
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
            deployDevBabel: {
                files: [{
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
            },
            modules: {
                files: {
                    '<%= dist %>js/modules/jquery.js': 'node_modules/jquery/dist/jquery.js',
                    '<%= dist %>js/modules/backbone.js': 'node_modules/backbone/backbone.js',
                    '<%= dist %>js/modules/underscore.js': 'node_modules/backbone/node_modules/underscore/underscore.js',
                    '<%= dist %>js/modules/require.js': 'node_modules/requirejs/require.js',
                    '<%= dist %>js/modules/text.js': 'node_modules/text/text.js',
                    '<%= dist %>js/modules/moment.js': 'node_modules/moment/moment.js',
                    '<%= dist %>js/modules/foundation.js': 'node_modules/foundation-sites/js/foundation.js',
                    '<%= dist %>js/modules/pizi-backbone.js': 'node_modules/pizi-backbone/build/pizi-backbone.js',
                }
            },
            appFile: {
                files: { '<%= dist %>js/app.js': 'src/js/app.js' }
            },
            distToServer: {
                files: [{
                    expand: true,
                    cwd: "<%= dist %>",
                    src: "**/*",
                    dest: "<%= serverFolder %>"
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: "<%= srcFile %>",
                    src: "**/*.html",
                    dest: "<%= dist %>"
                }]
            }
        },
        clean: {
            options: {
                force: true
            },
            server: '<%= serverFolder %>',
            dist: '<%= dist %>',
            // Clean the css and less files copied with grunt-bower
            bower: "<%= serverFolder %>/trash",
        },
        babel: {
            options: {
                plugins: ["add-module-exports", "transform-es2015-modules-amd"]
            },
            dist: {
                files: [{
                    "expand": true,
                    "cwd": 'src/js/',
                    "src": ["**/*.js", '!app.js'],
                    "dest": 'dist/js/',
                    "ext": ".js"
                }]
            }
        },
        bower: {
            dev: {
                dest: '<%= serverFolder %>/trash',
                js_dest: '<%= serverFolder %>/js/lib',
                options: {
                    expand: true
                }
            }
        },
        watch: {
            sass: {
                files: "<%= sassDevFiles %>",
                tasks: ['sass']
            },
            css: {
                files: "src/css/style.css",
                tasks: ['copy:deployDev'],
                options: {
                    spawn: false,
                }
            },
            js: {
                files: "<%= jsDevFiles %>",
                tasks: ['jshint', 'copy:deployDev'],
                options: {
                    spawn: false,
                }
            },
            html: {
                files: "<%= htmlDevFiles %>",
                tasks: ['copy:deployDev'],
                options: {
                    spawn: false,
                }
            }
        },
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean:dist', 'babel', 'sass', 'copy:appFile', 'copy:html', 'copy:modules']);
    grunt.registerTask('deployDev', ['jshint', 'sass', 'clean:deployDev', 'copy:deployDev', 'bower', 'clean:bower']);
    grunt.registerTask('deployBuild', ['build', 'clean:server', 'copy:distToServer']);
};
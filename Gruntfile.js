module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            files: [ 'src/**/*.js', 'test/**/*.js' ],
            options: {
                bitwise: true, 
                camelcase: true, 
                curly: true, 
                eqeqeq: true, 
                forin: true, 
                immed: true,
                indent: 4, 
                latedef: true, 
                newcap: true, 
                noempty: true, 
                nonew: true, 
                quotmark: true, 
                jquery: true,
                undef: true, 
                unused: true, 
                strict: true, 
                trailing: true, 
                browser: true, 
                node: true, 
                white: false,
                globals: {
                    define: true,
                    window: true
                }
            }
        }
    });

    //
    // Plugins
    //
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    //
    // Tasks
    //
    grunt.registerTask('default', ['jshint', 'uglify']);
    grunt.registerTask('lint', ['uglify']);
    grunt.registerTask('travis', ['jshint']);
    grunt.registerTask('all', ['jshint', 'uglify']);
};
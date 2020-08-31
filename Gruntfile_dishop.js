module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            options: {
                separator: ";\n"
            },
            dist1: {
                src: ['wa-apps/shop/themes/dishop/js/src/*.js'],
                dest: 'wa-apps/shop/themes/dishop/js/theme.js'
            },
            dist2: {
                src: ['wa-apps/shop/themes/dishop-mobile/js/src/*.js'],
                dest: 'wa-apps/shop/themes/dishop-mobile/js/theme.js'
            }
        },
        cacheBust: {
            dishop: {
                options: {
                    queryString:true,
                    assets: [
                        'wa-apps/shop/themes/dishop/css/*',
                        'wa-apps/shop/themes/dishop/js/theme.js',
                        'wa-apps/shop/themes/common/js/parts2/*',
                        'wa-apps/shop/themes/dishop-mobile/css/*',
                        'wa-apps/shop/themes/dishop-mobile/js/theme.js'
                    ]
                },
                src: [
                    'wa-apps/shop/themes/dishop/_includes/head_css.html',
                    'wa-apps/shop/themes/dishop/_includes/end_prod.html',
                    'wa-apps/shop/themes/dishop/_includes/checkout.html',

                    'wa-apps/shop/themes/dishop-mobile/_includes/head.html',
                    'wa-apps/shop/themes/dishop-mobile/_includes/end_prod.html',
                    'wa-apps/shop/themes/dishop-mobile/_includes/checkout.html'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.registerTask('default', ['concat:dist1', 'concat:dist2', 'cacheBust']);
};
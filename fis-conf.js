var urlPre = '/zt/xxx'
var mergeConfg = {
    '/src/index.html': 'index',
    '/src/page1.html': 'page1'
}

//添加忽略的文件列表
fis.set('project.ignore', [
  'output/**',
  'node_modules/**',
  '.git/**',
  '.svn/**',
  'package.json',
]);


//package 设置
fis.match('::package', {
    spriter: fis.plugin('csssprites-group', {
        margin: 10,
        layout: 'matrix',
        to: '../img'
    })
});



//资源预处理
fis.match('css/*.scss', {
    parser: fis.plugin('node-sass'),
    rExt: '.css',
});
fis.match('css/*.{scss,css}', {
    useSprite: true,
});

fis.match('src/(**)', {
    release: '$1',
    useHash: true
});
fis.match('**.html', {
    useHash:false 
});

fis.match('src/(test/**)', {
  release: '$1',
  useHash:false 
});

fis.match('/src/test/server.conf', {
  release: '/config/server.conf'
});

//fis.match('**/another.css', {
//  release: false
//});


var boot_config = {
    'src/index.html': 'pkg_index',
    'src/page1.html': 'pkg_page1'
};
var pageFiles = Object.keys(boot_config);

// 利用fis的loader进行css/js合并
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        allInOne: {
            js: function(filepath) {
                return 'js/pkg/' + mergeConfg[filepath] + '.js';
            },
            css: function(filepath) {
                return 'css/pkg/' + mergeConfg[filepath] + '.css';
            }
        }

    })
});

//调试时的打包配置
fis.media('debug').match('*.{js,css,scss,png}', {
    useHash: false,
    useSprite: false,
    optimizer: null
});

// 上线时打包配置
fis.media('prod')
    .match('*.{css,scss}', {
        //useHash: true,
        optimizer: fis.plugin('clean-css'),
        domain: 'http://c.58cdn.com.cn' + urlPre
    })
    .match('*.png', {
        useHash: true,
        optimizer: fis.plugin('png-compressor'),
        domain: 'http://j2.58cdn.com.cn' + urlPre
    })
    .match('*.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js'),
        domain: 'http://j1.58cdn.com.cn' + urlPre
    })
    .match('lib/*.js', {
        domain: 'http://j1.58cdn.com.cn' + urlPre
    })
    /* .match('*.html', {
         //invoke fis-optimizer-html-minifier
         optimizer: fis.plugin('html-minifier')
     });*/

//deploy
fis.media('qa').match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://192.168.119.5:8999/receiver',
    to: '/home/fe/webs/fis3_demo' // 注意这个是指的是测试机器的路径，而非本地机器
  })
})
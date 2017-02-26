/**
 * gulp 실행 예제
 * webpack.config.js 와 동일 내용입니다.
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const regJS = /\.js$/;
const regMap = /\.map$/gi;
const regDotFolder = /^\./;
const regMin = /\.min\.js/gi;
const regModules = /modules$/i;
const regBundle = /\.bundle\.js/gi;


/**
 * 모듈 탐색을 시작할 루트 경로 설정
 * require(모듈명)에서의 모듈명을 어떻게 해석할지에 대한 옵션.
 * @param list
 * @returns {Array}
 */
const setRoot = list => {
    /**
     * fs.readdir 동기 버전
     * 디렉토리에서 '.'와 '..'를 제외한 파일명들의 배열이다.
     * http://nodejs.sideeffect.kr/docs/v0.8.20/api/fs.html#fs_fs_readdirsync_path
     */
    const modules = fs.readdirSync('./src/', 'utf8') || [];

    // 동작 디버그 코드
    console.log('\n[SetRoot Start]');
    console.log('-----------------------------------');
    console.log('arguments:', list);
    console.log('readdirSync -> modules:', modules);

    var copy = modules.slice(0);
    console.log('filter before:', copy.toString());
    copy.forEach(dir => {
        console.log('regModules.test(' + dir + '):', regModules.test(dir));
    });
    var filterResult = copy.filter(dir => regModules.test(dir));
    console.log('filter after:', '[', filterResult.toString(), ']');

    /**
     * path.resolve
     * 전달받은 경로의 절대경로를 돌려줍니다.
     */
    var result = modules
        .filter(dir => regModules.test(dir))
        .map(dir => './src/' + dir)
        .concat(list || [])
        .map(dir => path.resolve(dir));

    console.log('filter -> modules:', result);
    console.log('[SetRoot End]\n');

    return result;
};


const setEntry = list => {
    console.log('\n[SetEntry Start]');
    console.log('-----------------------------------');
    console.log('setEntry, arguments:\n', list);

    /**
     * .DS_Store 폴더 제거
     * Arrow Function 은 기본이 결과를 return 합니다.
     * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/%EC%95%A0%EB%A1%9C%EC%9A%B0_%ED%8E%91%EC%85%98
     */
    list = list
        .filter(entry => regDotFolder.test(entry) === false);

    console.log('fiter result:\n', list);

    /**
     * Array.reduce
     * reduce() 메서드는 누산기(accumulator) 및 배열의 각 값(좌에서 우로)에 대해 (누산된) 한 값으로 줄도록 함수를 적용합니다.
     * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
     */
    var result = list.reduce((entry, app) => {
        app = app.replace(regJS, '');
        entry[app] = './src/test/' + app + '/index.js';
        return entry;
    }, {});

    console.log('result:', result);
    console.log('[SetEntry End]\n');
    return result;
};



const base = {
    /**
     * require(모듈명)에서의 모듈명을 어떻게 해석할지에 대한 옵션.
     *
     * resolve.root
     * (default: node_modules/) 모듈 탐색을 시작할 루트 경로.
     * node의 모듈 시스템과 마찬가지로, 하위 폴더가 아닌 상위 폴더로 탐색을 진행한다.
     * 절대 경로를 제시해야 한다는 점에 유의
     *
     * 예 )
     * root: [ path.resolve("./bower_components") ]
     * bower_components를 root로 인식하도록 설정했습니다.
     * 상대경로로 bower_components까지 접근해서 로드하지 않아도 됩니다.
     *
     * resolve.extensions
     * 모듈명 뒤에 여기 명시된 확장자명들을 붙여보며 탐색을 수행한다.
     * 즉, 위의 설정 파일에서처럼 extensions: ['', '.js', '.css'] 으로
     * 설정되어 있으면 require('abc')를 resolve 하기 위해 abc, abc,js, abc.css를 탐색한다.
     * hjlog.js를 보면 hjlog.scss를 require할 때는 확장자까지 명시했음을 볼 수 있다.
     * 이 옵션에 'scss'가 포함되어 있지 않기 때문.
     *
     * extensions: ['', '.js', '.json'],
     * require('xxx.js')가 아니라 require('xxx')로 로드할 수 있습니다.
     */
    resolve: {
        root: setRoot([
            './vendor',
            './node_modules'
        ])
    },

    entry: setEntry(fs.readdirSync('./src/test/', 'utf8')),

    /**
     * publicPath: 웹사이트에서 해당 에셋에 접근하기 위해 필요한 경로.
     */
    output: {
        path: './dist/test/',
        publicPath: './assets/',
        filename: '[name].min.js'
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin('commons.min.js'),
        /**
         * 브라우저 환경의 전역 scope 로 미리 등록시켜주는 플러그인
         */
        new webpack.ProvidePlugin({
            $: 'jquery',
            ns: 'namespace'
        }),

        new CopyWebpackPlugin([
            {
                from: './src/index.html',
                to: '../'
            },
            {
                context: './src/test',
                from: '**/*',
                to: '../test',
                transform: content =>
                    new Buffer(content).toString('utf-8').replace(regBundle, '.min.js')
            }
        ], {
            ignore: [
                'ui.html',
                'asset.html'
            ]
        })
    ]
};


const production = {
    name: 'PRODUCTION',

    module: {
        loaders: [
            {
                test: regJS,
                /**
                 * exclude 프로퍼티를 이용해 제외할 디렉토리를 정하거나
                 * include 프로퍼티를 이용해 적용시킬 디렉토리만 따로 설정 할 수도 있다.
                 */
                exclude: /node_modules|vendor/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        })
    ]
};


const development = {
    name: 'DEVELOPMENT',

    module: {
        loaders:[
            {test: /\.html$/, loader: 'raw-loader'},
            {test: /\.css$/, loader: 'raw-loader'},
            {test: /\.js$/, loader: 'babel-loader',
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },

    watch: true,
    debug: true,
    /**
     * sourcemap: 실제 map 파일을 생성
     * inline-source-map: 컴파일된 파일에서도 원래의 파일 구조를 확인할 수 있는 옵션 (메모리에서 map 을 만드는거 같다)
     */
    devtool: 'inline-source-map',
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 8800,
            server: {
                baseDir: './'
            },

            /**
             * 브라우저에 띄울 시작 페이지
             * 예) http://localhost:3000/test/index.html
             */
            startPath: '/dist/index.html'
        })
    ],

    /**
     * contentBase
     * https://webpack.github.io/docs/webpack-dev-server.html
     *
     * Automatic Refresh
     * Iframe mode, Inline mode
     * http://webpack.github.io/docs/webpack-dev-server.html
     *
     * inline, hot 옵션
     * inline 은 전체 페이지에 대한 실시간 리로딩(“Live Reloading”) 옵션이며,
     * hot 은 컴포넌트가 수정 될 경우 그 수정된 부분만 리로드 해주는 부분 모듈 리로딩(“Hot Module Reloading”) 옵션이다.
     * 만약 두개 옵션을 모두 지정할 경우 “Hot Module Reloading”이 처음 발생한다.
     * 그리고 “Hot Module Reloading”이 안되면 전체 페이지 로딩을 한다.
     * http://webframeworks.kr/tutorials/translate/webpack-the-confusing-parts/
     */

    /*devServer: {
     port: 9000,
     contentBase: path.resolve('./src'),
     inline: true,
     progress: true,
     colors: true
     }*/
};


gulp.task('build', function(){
    webpack(Object.assign(base, production), function(err, stats) {
        if(err) console.log('WEBPACK ERROR[' + stats + ']:' + err.toString());
    });
});


gulp.task('browser.sync', function(){
    webpack(Object.assign(base, development), function(err, stats) {
        if(err) console.log('WEBPACK ERROR[' + stats + ']:' + err.toString());
    });
});

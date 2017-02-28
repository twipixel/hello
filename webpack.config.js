
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const regJS = /\.js$/;
const regMap = /\.map$/gi;
const regHTML = /\.html$/;
const regDotFolder = /^\./;
const regMin = /\.min\.js/gi;
const regModules = /modules$/i;
const regBundle = /\.bundle\.js/gi;

const PATH_SRC = './src/';
const PATH_TEST = './test/';
const PATH_DIST = './dist/';
const PATH_ASSET = './asset/';
const PATH_EXTERNAL = './external/';
const PATH_LIB = PATH_EXTERNAL + 'lib/';
const PATH_VENDOR = PATH_EXTERNAL + 'vendor/';
const PATH_NODE_MODULES = './node_modules';




/**
 * setRoot 함수에서
 * modules.filter(dir => regModules.test(dir)) 실행 과정을 출력합니다.
 * @param modules
 */
const debugSetRoot = modules => {

    console.log('\n DebugSetRoot');
    console.log('----------------------------------------');
    console.log('fs.readdirSync(PATH_SRC, utf8) -> modules:', modules);
    console.log('----------------------------------------');

    var copy = modules.slice(0);

    copy.forEach(dir => {
        console.log('regModules.test(' + dir + '):', regModules.test(dir));
    });
    var filterResult = copy.filter(dir => regModules.test(dir));
    console.log('modules.filter(dir => regModules.test(dir)) -> [' + filterResult.toString() + ']');
};


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
    const modules = fs.readdirSync(PATH_SRC, 'utf8') || [];

    debugSetRoot(modules);

    /**
     * path.resolve
     * 전달받은 경로의 절대경로를 돌려줍니다.
     */
    var result = modules
        .filter(dir => regModules.test(dir))
        .map(dir => './src/' + dir)
        .concat(list || [])
        .map(dir => path.resolve(dir));

    console.log('resolve.root:', result);

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
        .filter(entry => regHTML.test(entry) === false)
        .filter(entry => regDotFolder.test(entry) === false);

    console.log('fiter result:\n', list);

    /**
     * Array.reduce
     * reduce() 메서드는 누산기(accumulator) 및 배열의 각 값(좌에서 우로)에 대해 (누산된) 한 값으로 줄도록 함수를 적용합니다.
     * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
     */
    var result = list.reduce((entry, app) => {
        app = app.replace(regJS, '');
        entry[app] = PATH_TEST + app + '/index.js';
        return entry;
    }, {});

    console.log('RESULT:\n', result);
    console.log('[SetEntry End]\n');
    return result;
};



const base = {
    /**
     * resolve
     * require(모듈명)에서의 모듈명을 어떻게 해석할지에 대한 옵션.
     *
     * resolve 설정하면
     * require('상대경로'); 를 하지 않고 바로 모듈명으로 요청 가능하고
     * 소스 내부에서도 resolve로 잡아둔 패스를 부터 경로를 잡고 들어가면 됩니다.
     * 예) src/es5/easejs/Triangle.js 를 import 하거나 require 할때
     * src/es5/easejs 까지 잡아두면 바로 Triangle 을 불러올 수 있습니다.
     *
     * resolve.root
     * (default: node_modules/) 모듈 탐색을 시작할 루트 경로.
     * node의 모듈 시스템과 마찬가지로, 하위 폴더가 아닌 상위 폴더로 탐색을 진행한다.
     * 절대 경로를 제시해야 한다는 점에 유의.
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
        root: setRoot([PATH_NODE_MODULES, PATH_LIB, PATH_VENDOR])
    },

    entry: setEntry(fs.readdirSync(PATH_TEST, 'utf8')),

    /**
     * publicPath: 웹사이트에서 해당 에셋에 접근하기 위해 필요한 경로.
     */
    output: {
        path: PATH_DIST + 'bundle',
        publicPath: PATH_ASSET,
        filename: '[name].js'
    },

    plugins: [

        /**
         * 공통으로 사용하는 파일을 뽑아주는 플러그인
         */
        new webpack.optimize.CommonsChunkPlugin('commons.js'),
        /**
         * 브라우저 환경의 전역 scope 로 미리 등록시켜주는 플러그인
         */
        new webpack.ProvidePlugin({
            $: 'jquery',
            ns: 'namespace'
        }),

        new CopyWebpackPlugin([
            {
                from: PATH_TEST + 'index.html',
                to: './../'
            },
            {
                context: PATH_TEST,
                from: '**/*',
                to: './../',
                transform: content =>
                    new Buffer(content).toString('utf-8').replace(regBundle, '.min.js'),
                ignore: '*.js'
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
     * sourcemap: 실제 map 파일을 생성 (map 파일을 따로 생성)
     * inline-source-map: 컴파일된 파일에서도 원래의 파일 구조를 확인할 수 있는 옵션
     * (inline 은 map 파일을 따로 생성하지 않고 bundle에 포함 시킵니다.)
     */
    devtool: '#inline-source-map',
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 9000,
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
     * https://webpack.github.io/docs/webpack-dev-server.html
     *
     * webpack-dev-server 의 장점은
     * bundle 된 파일을 메모리에 가지고 있어서 빠릅니다.
     * 설정한 포트 번호로 접근해서 페이지로 접근합니다.
     * (http://localhost:9000)
     * 속도도 빠르고 페이지 리로딩도 알아서 해주니까 개발할 때 좋습니다.
     *
     * contentBase: 서버 시작 위치 설정
     * src 로 정하면 src을 기본 베이스로 시작합니다.
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
     // contentBase: path.resolve('src/'),
     // inline: true,
     progress: true,
     colors: true,
     publicPath:path.resolve('assets'),
     }*/
};


/**
 * package.json 을 통해
 * production 과 development 를 구분 지을 수 있다.
 *
 * "scripts": {
    "build": "NODE_ENV=production webpack",
    "start": "NODE_ENV=development webpack-dev-server --content-base ./build"
    }
 *
 * process.env.NODE_ENV !== "production"
 */
module.exports = (() => {
    var plugins = base.plugins || [];
    var cfg = development;

    if (process.argv.indexOf('--build') !== -1) {
        cfg = production;
    }

    /**
     * base 플러그인인을 build 옵션에 따라
     * production 과 development 플로그인 합칩니다.
     */
    cfg.plugins = plugins.concat(cfg.plugins || []);

    console.log('[WEBPACK START ' + cfg.name + ' MODE]');
    return Object.assign(base, cfg);
})();

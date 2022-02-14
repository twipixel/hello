const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const RemoveWebpackPlugin = require('remove-webpack-plugin');

const regJS = /\.js$/;
const regMD = /\.md$/;
const regMap = /\.map$/gi;
const regHTML = /\.html$/;
const regDotFolder = /^\./;
const regMin = /\.min\.js/gi;
const regModules = /modules$/i;
const regBundle = /\.bundle\.js/gi;

const PATH_SRC = './src/';
const PATH_ASSET = './asset/';
const PATH_EXTERNAL_LIB = './external/lib/';
const PATH_EXTERNAL_VENDOR = './external/vendor/';
const PATH_NODE_MODULES = './node_modules';

const PATH_2D = './lab/2d/';
const PATH_DIST_2D = './dist/2d/';
const PATH_2D_START = PATH_DIST_2D + 'index.html';

const PATH_3D = './lab/3d/';
const PATH_DIST_3D = './dist/3d/';
const PATH_3D_START = PATH_DIST_3D + 'index.html';

const PATH_IMAGE = './lab/image/';
const PATH_DIST_IMAGE = './dist/image/';
const PATH_IMAGE_START = PATH_DIST_IMAGE + 'index.html';

const PATH_WEBGL = './lab/webgl/';
const PATH_DIST_WEBGL = './dist/webgl/';
const PATH_WEBGL_START = PATH_DIST_WEBGL + 'index.html';

const PATH_PAINT = './lab/paint/';
const PATH_DIST_PAINT = './dist/paint/';
const PATH_PAINT_START = PATH_DIST_PAINT + 'index.html';

/**
 * Browser Sync 할 시작 패스를 선택합니다.
 * 시작 패스를 선택하면 그 모듈을 Browser Sync 해서 보여 줍니다.
 * 3d, webgl, paint 에서 선택합니다.
 * 그리고 npm run browser-sync 을 실행하면
 * 해당 모듈만 Browser Sync 가 적용 됩니다.
 */
  // const PATH_START = PATH_2D_START;
  // const PATH_START = PATH_3D_START;
  // const PATH_START = PATH_IMAGE_START;
  // const PATH_START = PATH_WEBGL_START;
const START_WITH = '3d';

const getStartPath = (env) => {
  const start = env.toUpperCase();
  switch (start) {
    case '2D':
      return PATH_2D_START;
    case '3D':
      return PATH_3D_START;
    case 'IMAGE':
      return PATH_IMAGE_START;
    default:
    case 'WEBGL':
      return PATH_WEBGL_START;
    case 'PAINT':
      return PATH_PAINT_START;
  }
};

/**
 * setRoot 함수에서
 * modules.filter(dir => regModules.test(dir)) 실행 과정을 출력합니다.
 * @param modules
 */
const debugSetRoot = modules => {
  console.log('\n DEBUG SET ROOT');
  console.log('----------------------------------------');
  console.log('fs.readdirSync(' + PATH_SRC + ', utf8) -> modules:', modules);
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


const setEntry = (list, entryPath) => {
  console.log('');
  console.log('[setEntry(' + list.length + ', ' + entryPath + ')]');
  console.log('-----------------------------------');
  console.log('setEntry arguments:\n', list);

  /**
   * .DS_Store 폴더 제거
   * Arrow Function 은 기본이 결과를 return 합니다.
   * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/%EC%95%A0%EB%A1%9C%EC%9A%B0_%ED%8E%91%EC%85%98
   */
  list = list
    .filter(entry => regMD.test(entry) === false)
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
    entry[app] = entryPath + app + '/index.js';
    return entry;
  }, {});

  console.log('RESULT:\n', result);
  console.log('[setEntry]');
  console.log('');
  return result;
};


///////////////////////////////////////////////////////////////////////////////
//
//  Lab 설정
//
///////////////////////////////////////////////////////////////////////////////


const config2d = {
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
    root: setRoot([PATH_NODE_MODULES, PATH_EXTERNAL_LIB, PATH_EXTERNAL_VENDOR])
  },

  entry: setEntry(fs.readdirSync(PATH_2D, 'utf8'), PATH_2D),

  /**
   * publicPath: 웹사이트에서 해당 에셋에 접근하기 위해 필요한 경로.
   */
  output: {
    path: PATH_DIST_2D + 'bundle',
    publicPath: PATH_ASSET,
    filename: '[name].js'
  },

  plugins: [

    new RemoveWebpackPlugin(PATH_DIST_2D),

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
        from: PATH_2D + 'index.html',
        to: './../'
      },
      {
        context: PATH_2D,
        from: '**/*',
        to: './../',
        transform: content =>
          new Buffer(content).toString('utf-8').replace(regBundle, '.min.js'),
        ignore: '*.js'
      }
    ], {
      ignore: [
        'ui.html',
        'asset.html',
        '*.md'
      ]
    }),

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


const config3d = {
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
    root: setRoot([PATH_NODE_MODULES, PATH_EXTERNAL_LIB, PATH_EXTERNAL_VENDOR])
  },

  entry: setEntry(fs.readdirSync(PATH_3D, 'utf8'), PATH_3D),

  /**
   * publicPath: 웹사이트에서 해당 에셋에 접근하기 위해 필요한 경로.
   */
  output: {
    path: PATH_DIST_3D + 'bundle',
    publicPath: PATH_ASSET,
    filename: '[name].js'
  },

  plugins: [

    new RemoveWebpackPlugin(PATH_DIST_3D),

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
        from: PATH_3D + 'index.html',
        to: './../'
      },
      {
        context: PATH_3D,
        from: '**/*',
        to: './../',
        transform: content =>
          new Buffer(content).toString('utf-8').replace(regBundle, '.min.js'),
        ignore: '*.js'
      }
    ], {
      ignore: [
        'ui.html',
        'asset.html',
        '*.md'
      ]
    }),

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
  }
};

const development = (startPath) => {
  return {
    name: 'DEVELOPMENT',

    module: {
      loaders: [
        {test: /\.html$/, loader: 'raw-loader'},
        {test: /\.css$/, loader: 'raw-loader'},
        {
          test: /\.js$/, loader: 'babel-loader',
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
        startPath,
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
     *
     */

    /*
    devServer: {
        port: 9000,
        contentBase: path.join(__dirname, './'),
        inline: true,
        progress: true,
        colors: true,
        publicPath:path.resolve('assets'),
    }
    */
  };
};


///////////////////////////////////////////////////////////////////////////////
//
//  Image 설정
//
///////////////////////////////////////////////////////////////////////////////


const configImage = {
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
    root: setRoot([PATH_NODE_MODULES, PATH_EXTERNAL_LIB, PATH_EXTERNAL_VENDOR])
  },


  /**
   * entry 는 string, array, object, object & array 식으로 설정할 수 있습니다.
   * https://github.com/FEDevelopers/tech.description/wiki/Webpack%EC%9D%98-%ED%98%BC%EB%9E%80%EC%8A%A4%EB%9F%B0-%EC%82%AC%ED%95%AD%EB%93%A4
   */
  entry: setEntry(fs.readdirSync(PATH_IMAGE, 'utf8'), PATH_IMAGE),

  /**
   * publicPath: 웹사이트에서 해당 에셋에 접근하기 위해 필요한 경로.
   */
  output: {
    path: PATH_DIST_IMAGE + 'bundle',
    publicPath: PATH_ASSET,
    filename: '[name].js'
  },

  plugins: [

    new RemoveWebpackPlugin(PATH_DIST_IMAGE),

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
        from: PATH_IMAGE + 'index.html',
        to: './../'
      },
      {
        context: PATH_IMAGE,
        from: '**/*',
        to: './../',
        transform: content =>
          new Buffer(content).toString('utf-8').replace(regBundle, '.min.js'),
        ignore: '*.js'
      }
    ], {
      ignore: [
        'ui.html',
        'asset.html',
        '*.md'
      ]
    }),

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


///////////////////////////////////////////////////////////////////////////////
//
//  WebGL 설정
//
///////////////////////////////////////////////////////////////////////////////


const configWebGL = {
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
    root: setRoot([PATH_NODE_MODULES, PATH_EXTERNAL_LIB, PATH_EXTERNAL_VENDOR])
  },


  /**
   * entry 는 string, array, object, object & array 식으로 설정할 수 있습니다.
   * https://github.com/FEDevelopers/tech.description/wiki/Webpack%EC%9D%98-%ED%98%BC%EB%9E%80%EC%8A%A4%EB%9F%B0-%EC%82%AC%ED%95%AD%EB%93%A4
   */
  entry: setEntry(fs.readdirSync(PATH_WEBGL, 'utf8'), PATH_WEBGL),

  /**
   * publicPath: 웹사이트에서 해당 에셋에 접근하기 위해 필요한 경로.
   */
  output: {
    path: PATH_DIST_WEBGL + 'bundle',
    publicPath: PATH_ASSET,
    filename: '[name].js'
  },

  plugins: [

    new RemoveWebpackPlugin(PATH_DIST_WEBGL),

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
        from: PATH_WEBGL + 'index.html',
        to: './../'
      },
      {
        context: PATH_WEBGL,
        from: '**/*',
        to: './../',
        transform: content =>
          new Buffer(content).toString('utf-8').replace(regBundle, '.min.js'),
        ignore: '*.js'
      }
    ], {
      ignore: [
        'ui.html',
        'asset.html',
        '*.md'
      ]
    }),

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


///////////////////////////////////////////////////////////////////////////////
//
//  Paint 설정
//
///////////////////////////////////////////////////////////////////////////////


const configPaint = {
  resolve: {
    root: setRoot([PATH_NODE_MODULES, PATH_EXTERNAL_LIB, PATH_EXTERNAL_VENDOR])
  },


  /**
   * entry 는 string, array, object, object & array 식으로 설정할 수 있습니다.
   * https://github.com/FEDevelopers/tech.description/wiki/Webpack%EC%9D%98-%ED%98%BC%EB%9E%80%EC%8A%A4%EB%9F%B0-%EC%82%AC%ED%95%AD%EB%93%A4
   */
  entry: setEntry(fs.readdirSync(PATH_PAINT, 'utf8'), PATH_PAINT),

  /**
   * publicPath: 웹사이트에서 해당 에셋에 접근하기 위해 필요한 경로.
   */
  output: {
    path: PATH_DIST_PAINT + 'bundle',
    publicPath: PATH_ASSET,
    filename: '[name].js'
  },

  plugins: [

    new RemoveWebpackPlugin(PATH_DIST_PAINT),

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
        from: PATH_PAINT + 'index.html',
        to: './../'
      },
      {
        context: PATH_PAINT,
        from: '**/*',
        to: './../',
        transform: content =>
          new Buffer(content).toString('utf-8').replace(regBundle, '.min.js'),
        ignore: '*.js'
      }
    ], {
      ignore: [
        'ui.html',
        'asset.html',
        '*.md'
      ]
    }),

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
 *
 * exports 를 []로 멀티로 설정할 경우
 * BrowserSyncPlugin 플러그인이 동작하지 않습니다.
 * BrowserSync 로 개발하고자 하는 경우 exports 설정을 한개만 등록해서 실행해야 합니다.
 */

/*
module.exports =
    (() => {
        var plugins = baseLab.plugins || [];
        var cfg = developmentLab;

        if (process.argv.indexOf('--build') !== -1) {
            cfg = productionLab;
        }

        cfg.plugins = plugins.concat(cfg.plugins || []);

        console.log('[WEBPACK START ' + cfg.name + ' MODE]');
        return Object.assign(baseLab, cfg);
    })();
*/


module.exports =
  (() => {

    const env = process.argv[2] || START_WITH;
    console.log('************************************************');
    console.log('process.argv', process.argv);
    console.log('env', env);
    console.log('************************************************');
    const startPath = getStartPath(env);
    /**
     * PRODUCTION 모드
     * 번들링 과정은 전체 빌드하도록 셋팅합니다.
     * 배열로 반환하면 multi output 셋팅이 가능합니다.
     */
    if (process.argv.indexOf('--build') !== -1) {

      console.log('');
      console.log('//////////////////////////////////////////////////////////////////');
      console.log('//');
      console.log('// PRODUCTION MODE');
      console.log('//');
      console.log('//////////////////////////////////////////////////////////////////');
      console.log('');

      var config = Object.assign(production);
      var lab2d = Object.assign(config2d, config);
      var lab3d = Object.assign(config3d, config);
      var labImage = Object.assign(configImage, config);
      var labWebGL = Object.assign(configWebGL, config);
      var labPaint = Object.assign(configPaint, config);

      return [lab2d, lab3d, labImage, labWebGL, labPaint];
    }
    /**
     * DEVELOPMENT 모드
     * BrowserSync는 [] 배열 반환시 동작하지 않습니다. (이유는 모릅니다.)
     * 3d, webgl, paint 등 현재 개발하고 있는 모드만 동작하도록 처리합니다.
     * 즉 해당 모듈만 반환하도록 처리 합니다. (멀티 처리 X)
     */
    else {

      console.log('');
      console.log('//////////////////////////////////////////////////////////////////');
      console.log('//');
      console.log('// DEVELOPMENT MODE, developmentStartPath:', startPath);
      console.log('//');
      console.log('//////////////////////////////////////////////////////////////////');
      console.log('');

      var config = Object.assign(development(startPath));

      switch (startPath) {
        case PATH_2D_START:
          var plugins = config2d.plugins || [];
          config.plugins = plugins.concat(config.plugins || []);
          return Object.assign(config2d, config);

        case PATH_3D_START:
          var plugins = config3d.plugins || [];
          config.plugins = plugins.concat(config.plugins || []);
          return Object.assign(config3d, config);

        case PATH_IMAGE_START:
          var plugins = configImage.plugins || [];
          config.plugins = plugins.concat(config.plugins || []);
          return Object.assign(configImage, config);

        case PATH_WEBGL_START:
          var plugins = configWebGL.plugins || [];
          config.plugins = plugins.concat(config.plugins || []);
          return Object.assign(configWebGL, config);

        case PATH_PAINT_START:
          var plugins = configPaint.plugins || [];
          config.plugins = plugins.concat(config.plugins || []);
          return Object.assign(configPaint, config);
      }
    }

  })();

/*
BrowserSync 를 위한 설정 예제)
exports 를 [] 로 설정하면 multi 설정이 가능합니다.
하지만 BrowserSync 는 동작하지 않습니다. 이유는 파악이 필요
module.exports =
    (() => {
        var plugins = baseLab.plugins || [];
        var cfg = developmentLab;

        if (process.argv.indexOf('--build') !== -1) {
            cfg = productionLab;
        }

        cfg.plugins = plugins.concat(cfg.plugins || []);

        console.log('[WEBPACK START ' + cfg.name + ' MODE]');
        return Object.assign(baseLab, cfg);
    })()
*/
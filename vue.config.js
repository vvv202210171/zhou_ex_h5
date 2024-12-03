"use strict";
const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg|pdf)(\?.*)?$/i;

const resolve = (dir) => path.join(__dirname, dir);
const IS_PROD = process.env.NODE_ENV === "production";
console.log(process.env.NODE_ENV);
module.exports = {
  publicPath: "./", // 署应用包时的基本 URL。 vue-router hash 模式使用
  outputDir: "./dist", //  生产环境构建文件的目录
  assetsDir: "static", //  outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  devServer: {
    port: 8086, // 端口
    proxy: {
      "/api": {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
      "/ws": {
        target: process.env.VUE_APP_BASE_API, //设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        ws: true,
      },
    },
    open: false, // 启动后打开浏览器
    overlay: {
      //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
      warnings: false,
      errors: true,
    },
  },
  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        prependData: `@import "@/assets/css/config.scss";`,
      },
      less: {
        modifyVars: {
          // 直接覆盖变量
          // 'text-color': '#fff',
          // 'background-color': '#151634',
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${path.join(
            __dirname,
            "./src/assets/css/vant-config.less"
          )}";`,
        },
      },
      postcss: {
        plugins: [
          require("postcss-pxtorem")({
            // 把px单位换算成rem单位
            rootValue: 37.5, // 换算的基数(设计图750的根字体为32)
            propList: ["*"],
          }),
        ],
      },
    },
  },
  configureWebpack: (config) => {
    //去掉console
    if (IS_PROD) {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }

    //开启Gzip
    const plugins = [];
    plugins.push(
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8,
      })
    );

    config.plugins = [...config.plugins, ...plugins];
    // config.name = name

    // 为生产环境修改配置...
    // if (IS_PROD) {
    //   // externals
    //   config.externals = externals
    // }

    // 在开发模式下启用 source maps
    if (!IS_PROD) {
      config.devtool = "source-map";
    }
  },

  chainWebpack: (config) => {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    // 别名 alias
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@img", resolve("src/assets/img"))
      .set("@api", resolve("src/service/api"));
    /**
     * 设置保留空格
     */
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
    /**
     * 打包分析
     */
    // if (IS_PROD) {
    //   config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
    //     {
    //       analyzerMode: 'static'
    //     }
    //   ])
    // }

    const imagesRule = config.module.rule("images");
    imagesRule.uses.clear();
    imagesRule
      .use("file-loader")
      .loader("url-loader")
      .options({
        limit: 1 * 1024,
        fallback: {
          loader: "file-loader",
          options: {
            name: "[name].[hash:8].[ext]",
            outputPath: "static/img", //决定打包出来的文件的路径 在 dist 下的路径
          },
        },
      });
    const fileRule = config.module.rule("file");
    fileRule.uses.clear();
    fileRule
      .test(/\.pdf$/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        outputPath: "static/file",
      });

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(!IS_PROD, (config) => config.devtool("cheap-source-map"));

    config.when(IS_PROD, (config) => {
      // config
      //   .plugin('ScriptExtHtmlWebpackPlugin')
      //   .after('html')
      //   .use('script-ext-html-webpack-plugin', [{
      //     // 将 runtime 作为内联引入不单独存在
      //     inline: /runtime\..*\.js$/
      //   }])
      //   .end()
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"),
            minChunks: 3, //  被至少用三次以上打包分离
            priority: 5, // 优先级
            reuseExistingChunk: true, // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          },
          node_vendors: {
            name: "chunk-libs",
            chunks: "initial", // 只打包初始时依赖的第三方
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
          vantUI: {
            name: "chunk-vantUI", // 单独将 vantUI 拆包
            priority: 20, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
            test: /[\\/]node_modules[\\/]_?vant(.*)/,
          },
        },
      });
      config.optimization.runtimeChunk("single");
    });
  },
};

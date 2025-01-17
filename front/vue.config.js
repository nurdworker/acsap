const path = require("path");

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set("@", path.resolve(__dirname, "src/assets/"));
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.output.filename = "js/[name].[hash].js";
      config.output.chunkFilename = "js/[name].[hash].js";
    }
  },
  outputDir: "../dist",
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3020/",
        // changeOrigin: true,
        // pathRewrite: {
        //   "^/api": "",
        // },
      },
    },
  },
};

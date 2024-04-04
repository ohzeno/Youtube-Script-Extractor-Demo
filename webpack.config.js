const path = require("path");

module.exports = {
  mode: "development", // 또는 'production'
  devtool: "source-map", // eval()은 CSP 위반이라 source-map을 사용
  entry: {
    content: "./src/content.ts",
    background: "./src/background.ts",
    popup: "./src/popup.ts",
  },
  output: {
    filename: "[name].js", // [name]은 entry 속성명(content, background, popup)에 따라 동적으로 결정됨
    path: path.resolve(__dirname, "dist/js"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

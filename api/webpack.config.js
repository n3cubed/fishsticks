const path = require("path");

module.exports = {
    entry: "./index.js",
    experiments: {
        asyncWebAssembly: true,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "api.js",
        library: {
            name: "api",
            type: "umd",
        },
        clean: true,
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
            },
        ],
    },
    devtool: "source-map",
};
const webpack = require('webpack');
module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            'STABLE_FEATURE': JSON.stringify(true),
            'EXPERIMENTAL_FEATURE': JSON.stringify(false),
            BROWSER_SUPPORTS_HTML5: true
        })
    ]
};
// https://dzone.com/articles/personalize-your-angular-build-with-webpack
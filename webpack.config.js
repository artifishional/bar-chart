const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [{
    mode: "development",
    entry: {
        'index': `${__dirname}/src/debug.js`,
    },
    output: {
        path: `${__dirname}/dist`,
        filename: `[name].js`
    },
	watch: true,
	plugins: [
        new CopyWebpackPlugin([
            { from: `${__dirname}/fill`, to: './' },
        ], {
            copyUnmodified: true
        }),
    ],
	module: {
		rules: [
			{
				test: /\.js$/,
				//exclude: [/node_modules/, /\.loader$/],
				use: {
					loader: "babel-loader",
					/*options: {
						presets: [
							[require.resolve('babel-preset-env')],
							require.resolve('babel-preset-stage-2')
						],
					}*/
				},
			}
		]
	},
}];
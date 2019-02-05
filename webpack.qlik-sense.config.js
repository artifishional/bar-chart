const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [{
    mode: "development",
	devtool: "none",
	entry: {
        'qlik-sense': `${__dirname}/src/qlik-sense.js`,
    },
    output: {
        path: `${__dirname}/dist`,
        filename: `[name].js`
    },
	plugins: [
		new CopyWebpackPlugin([
			{ from: `${__dirname}/bar-chart.qext`, to: './' },
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
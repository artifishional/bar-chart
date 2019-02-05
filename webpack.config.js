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
			{from: `${__dirname}/fill`, to: './'},
		], {
			copyUnmodified: true
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: "babel-loader",
				},
			}
		]
	},
}];
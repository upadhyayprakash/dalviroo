module.exports = {
   entry: './main.js',
   output: {
      filename: 'bundle.js'
   },
   module: {
      loaders: [
         {
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
         },
		 {
		   test: /\.css$/,
		   use: [
			 'style-loader',
			 'css-loader'
		   ]
		 }
      ]
   },
   devServer: {
      port: 7777
   }
};
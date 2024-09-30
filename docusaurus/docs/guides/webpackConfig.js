module.exports = function(config) {
    // Webpack Configuration
  
    // Ignore the "compiled with problems" error
    config.webpack.cache = false;
    config.webpack.ignoreWarnings = [/Failed to parse source map/];
    config.webpack.watchOptions = {
      ignored: ['node_modules'],
    };
  
    return config;
  };
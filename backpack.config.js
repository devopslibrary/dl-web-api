// backpack.config.js
module.exports = {
  webpack: (config, options, webpack) => {
    // changes the name of the entry point from index -> main.js
    config.entry.main = ["./app.js"];
    return config;
  }
};

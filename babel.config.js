module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Uncomment this plugin once react-native-worklets-core is installed in later standalone compile phases
      // ['react-native-worklets-core/plugin'],
    ],
  };
};

/**
 * This is a convenience file for autoimporting all files (other than this one) into
 * the main store as modules. They should be named store-something.js which will be converted to
 * a namedspaced module identified as storeSomething.
 */
import camelCase from 'lodash/camelCase';
const requireModule = require.context('.', false, /\.js$/);
const modules = {};

requireModule.keys().forEach(fileName => {
  // Don't register this file as a module
  if (fileName === './index.js') return;

  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''));
  modules[moduleName] = {
    namespaced: true,
    ...requireModule(fileName).default
  };
});

export default modules;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HandlebarsHelper = require('./handlebars-helper');
const siteOption = require('../src/siteOption.json');
const buildmap = require('../src/buildmap.json');

const templateProcessor = function(params) {
  const source = require('fs').readFileSync(params.hbs, 'utf8');
  const contents = HandlebarsHelper.compile(source, {
      knownHelpersOnly: false,
  });

  return '<!DOCTYPE html>'
   + `<html lang=${siteOption.lang}">`
   + '<head>'
   + '<meta charset="UTF-8">'
   + '<meta http-equiv="X-UA-Compatible" content="IE=edge">'
   + '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0">'
   + `<link rel="stylesheet" href="/assets/clientlib-lang/${siteOption.lang}/css/font.css">`
   + '<link rel="stylesheet" href="./clientlibs/css/main.css"></link>'
   + '</head>'
   + '<body>'
   + '<div data-scroll-container data-direction>'
   + '<main id="main" class="main">'
   + contents({})
   + '</main>'
   + '</div>'
   + '<script src="/assets/clientlib-base/js/vendors.js"></script>'
   + '<script src="./clientlibs/js/main.js"></script>'
   + '</body>'
   + '\n</html>';
}

const htmlPlugins = [];

const entryComponents = buildmap.map(module => `./src/components/${module.type}/${module.component}/component.hbs` )

const entry = entryComponents.reduce(function(obj, el) {

  const ret = el.replace('component.hbs', '');
  const resPath = ret.replace('./src/', './');

  const splitRet = ret.split('/');
  const id = splitRet[splitRet.length - 3] + '/' + splitRet[splitRet.length - 2];


  const hbs = el.replace('component.hbs', '');

  htmlPlugins.push(
    new HtmlWebpackPlugin({
      inject: false,
      minify: false,
      template: el,
      filename: resPath + 'component.html'
    })
  );
  
  htmlPlugins.push(
    // components (preview)
  new HtmlWebpackPlugin({
      inject: false,
      minify: false,
      templateParameters: { hbs: el },
      templateContent: templateProcessor,
      filename: resPath + 'index.html'
    })
  );

  obj[id] = [
    ret + 'clientlibs/js/main.js',
    ret + 'clientlibs/css/main.scss',
  ];
  return obj;
}, {
    'clientlib-common': [
    './src/assets/clientlib-common/js/main.js',
    './src/assets/clientlib-common/scss/main.scss',
    ],
  'system': [
    './src/index.js',
    './src/assets/clientlib-base/scss/buildmap.scss'
  ],
});

module.exports.entry = entry;
module.exports.htmlPlugins = htmlPlugins;
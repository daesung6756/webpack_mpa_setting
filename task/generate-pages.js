const HtmlWebpackPlugin = require('html-webpack-plugin');
const HandlebarsHelper = require('./handlebars-helper');
const fs = require('fs');
const codingmap = require('../src/buildmap.json');

// const log = require('fancy-log');

const generatePages = function(pageOpt) {

  const groupBy = function(data, key) {
    return data.reduce(function (carry, el) {
      var group = el[key];
  
      if(carry[group] === undefined) {
        carry[group] = [];
      }
  
      carry[group].push(el)
      return carry
    }, {})
  }
  
  const pageTemplate = function(params) {
    const css = [];
    const content = [];
    const script = [];
  
    params.components.forEach(component => {
      // [NOTE] 핸들바 컴포넌트 등록 후 가져오기
      HandlebarsHelper.registerPartial(component.component, fs.readFileSync(`./src/components/${component.type}/${component.component}/component.hbs`, 'utf8'));
      // log(component.component, component.jsonBlock);
  
      css.push(`<link rel="stylesheet" href="/components/${component.type}/${component.component}/clientlibs/css/main.css">`);
      // [NOTE] json 객체 파라미터 실패(아래 형태), param="pt-xl" 형태의 스트링 파라미터는 성공
      // content.push(`{{>${component.component} param=${component.jsonBlock}}}`);
      content.push(`{{>${component.component}}}`);
      script.push(`<script src="/components/${component.type}/${component.component}/clientlibs/js/main.js"></script>`);
  
      // [TEMP]
      if(component.invertHeader) {
        script.push(`<script> document.getElementById("header").classList.add("is-invert") </script>`);
      }
    })
  
  const source = `
  {{#extend "layout"}}
  
  {{#content "head" mode="append"}}
  ${css.join('\n')}
  {{/content}}
  
    {{#content "body"}}
  
      ${content.join('\n')}
  
    {{/content}}
  
    {{#content "foot" mode="append"}}
    ${script.join('\n')}
    {{/content}}
  
  {{/extend}}
  `
  
    const template = HandlebarsHelper.compile(source, {
      knownHelpersOnly: false,
    });
  
    return template({
      page: pageOpt
    });
  }
  
  const pages = [];
  
  let path = groupBy(codingmap, 'path');
  
  for (const key in path) {
    // if (Object.hasOwnProperty.call(object, key)) {
    //   const element = object[key];
    // }
  
    pages.push(
      new HtmlWebpackPlugin({
        inject: false,
        minify: false,
        templateParameters: { components: path[key] },
        templateContent: pageTemplate,
        filename: './pages' + key,
      })
    );
  
  }

  return pages;
}

module.exports.generatePages = generatePages;
const Handlebars = require('handlebars');
const layouts = require('handlebars-layouts');
const fs = require('fs');

// const log = require('fancy-log');

Handlebars.registerHelper(layouts(Handlebars));
layouts.register(Handlebars);


Handlebars.registerPartial('layout', fs.readFileSync('./src/templates/layout.hbs', 'utf8'));
Handlebars.registerPartial('header', fs.readFileSync('./src/templates/partials/header.hbs', 'utf8'));
Handlebars.registerPartial('footer', fs.readFileSync('./src/templates/partials/footer.hbs', 'utf8'));
Handlebars.registerPartial('sideNav', fs.readFileSync('./src/templates/partials/side-nav.hbs', 'utf8'));
Handlebars.registerPartial('cookiePop', fs.readFileSync('./src/templates/partials/cookie-pop.hbs', 'utf8'));

Handlebars.registerHelper('set', function(name, val, opt) {
  if (typeof opt === 'undefined') {
    //noinspection JSUnusedAssignment
    opt = val;
    val = val.hash;
  }

  this[name] = val;
});

Handlebars.registerHelper('jsonBlock', function(name, opt) {
  // log('=================================');
  // log(name, '|!@#|', JSON.parse(opt.fn()));
  // log('=================================');
  this[name] = JSON.parse(opt.fn());
});

Handlebars.registerHelper('inc', function(val) {
  return parseInt(val) + 1;
});

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
Handlebars.registerHelper('ifDiff', function(v1, v2, options) {
  if (v1 != v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

module.exports = Handlebars;
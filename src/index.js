if(process.env.NODE_ENV === 'production') {

  var console = {};
  console.log = function(){};
  console.warn = function(){};
  console.error = function(){};

  window.console = console;
}
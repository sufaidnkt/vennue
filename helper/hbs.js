var hbs = require('hbs');
hbs.registerHelper('timestampToDate', function (timestamp) {
  return new Date(parseInt(timestamp*1000)).toDateString();
});

hbs.registerHelper('times', function (n, block) {
  var accum = '';
  for (var i = 0; i < n; ++i)
    accum += block.fn(i);
  return accum;
});


hbs.registerHelper('for', function (from, to, incr, block) {
  var accum = '';
  for (var i = from; i <= to; i += incr)
    accum += block.fn(i);
  return accum;
});


// hbs.registerHelper('for', function (from, to, incr, options) {
//   var fn = options.fn, inverse = options.inverse;
//   var ret = "";

//   for (var i = from; i <= to; i += incr)
//     ret = ret + fn( i, { i: i, iPlusincr: i + 1 });
//   return ret;
// });

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!=':
      return (v1 != v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

hbs.registerHelper('numberFormat', function (value, options) {
  
  // Helper parameters
  var dl = options.hash['decimalLength'] || 2;
  var ts = options.hash['thousandsSep'] || ',';
  var ds = options.hash['decimalSep'] || '.';

  // Parse to float
  var value = parseFloat(value)/100;

  // The regex
  var re = '\\d(?=(\\d{3})+' + (dl > 0 ? '\\D' : '$') + ')';

  // Formats the number with the decimals
  var num = value.toFixed(Math.max(0, ~~dl));
  
  // Returns the formatted number
  return (ds ? num.replace('.', ds) : num).replace(new RegExp(re, 'g'), '$&' + ts);
});

hbs.registerHelper('arithmatic', function (v1, operator, v2) {

  switch (operator) {
    case '+':
      return (v1+v2);
    case '-':
      return (v1-v2);
    case '*':
      return (v1*v2);
    case '/':
      return (v1/v2);
    case '%':
      return (v1 % v2);
  }
});


hbs.registerHelper('UnixToDate', function (unixTimestamp) {
  dateObj = new Date(unixTimestamp * 1000); 
  utcString = dateObj.toUTCString(); 
  return utcString

});
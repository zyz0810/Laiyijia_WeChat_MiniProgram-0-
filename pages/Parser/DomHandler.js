//DomHandler.js
var Common = 1, Rich = 2;
var trustTag = {
  a: Rich,
  abbr: Common,
  audio: Rich,
  b: Common,
  blockquote: Common,
  br: Rich,
  code: Rich,
  col: Rich,
  colgroup: Rich,
  dd: Common,
  del: Common,
  div: Common,
  dl: Common,
  dt: Common,
  em: Common,
  fieldset: Common,
  font: Common,
  h1: Rich,
  h2: Rich,
  h3: Rich,
  h4: Rich,
  h5: Rich,
  h6: Rich,
  hr: Rich,
  i: Common,
  img: Common,
  ins: Common,
  label: Common,
  legend: Common,
  li: Rich,
  ol: Rich,
  p: Common,
  pre: Common,
  q: Common,
  source: Rich,
  span: Common,
  strong: Common,
  sub: Rich,
  sup: Rich,
  table: Rich,
  tbody: Rich,
  td: Rich,
  tfoot: Rich,
  th: Rich,
  thead: Rich,
  tr: Rich,
  u: Common,
  ul: Rich,
  video: Common
};
var textTag = {
  b: true,
  del: true,
  em: true,
  i: true,
  ins: true,
  q: true,
  span: true,
  strong: true
};
var ignoreTag = {
  head: true,
  area: true,
  base: true,
  basefont: true,
  command: true,
  embed: true,
  iframe: true,
  frame: true,
  input: true,
  textarea: true,
  isindex: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  track: true,
  wbr: true,
  path: true,
  circle: true,
  ellipse: true,
  line: true,
  rect: true,
  use: true,
  stop: true,
  polyline: true,
  polygon: true,
  map: true,
  canvas: true,
};

function DomHandler(style, tagStyle) {
  this.imgList = [];
  this.nodes = [];
  this._style = ParseClass(style, tagStyle || {});
  this._tagStack = [];
}
function ParseClass(style, options) {
  if (style) {
    var classes = style.match(/[^\{\}]+?\{([^\{\}]*?({[\s\S]*?})*)*?\}/g);
    if (classes) {
      for (var item of classes) {
        try {
          var name = item.match(/(\S.*?)\{/)[1];
          name = name.replace(/\s*$/g, '');
          if (/[\s@>:]/.test(name)) continue;
          var content = item.match(/\{([\s\S]*?)\}/)[1];
          if (/,/.test(item)) {
            var items = name.split(',');
            for (var i of items) {
              i = i[0] + i.substring(1).replace(/\./g, ' ');
              options[i] = content;
            }
          } else {
            name = name[0] + name.substring(1).replace(/\./g, ' ');
            options[name] = content;
          }
        } catch (err) {
          continue;
        }
      }
    }
  }
  if (!options.blockquote) options.blockquote = 'background-color:#f6f6f6;border-left:3px solid #dbdbdb;color:#6c6c6c;padding:5px 0 5px 10px';
  if (!options.code) options.code = 'padding:0 1px 0 1px;margin-left:2px;margin-right:2px;background-color:#f8f8f8;border:1px solid #cccccc;border-radius:3px';
  return options;
}
DomHandler.prototype._addDomElement = function(element) {
  var parent = this._tagStack[this._tagStack.length - 1];
  var siblings = parent ? parent.children : this.nodes;
  siblings.push(element);
};
DomHandler.prototype.onopentag = function(name, attrs) {
  if (ignoreTag[name]) return;
  var element = {
    children: []
  };
  if (this._style[name]) attrs.style += (';' + this._style[name]);
  if (this._style['.' + attrs.class]) attrs.style += (';' + this._style['.' + attrs.class]);
  if (this._style['#' + attrs.id]) attrs.style += (';' + this._style['#' + attrs.id]);
  if (!trustTag[name]) name = 'div';
  if (textTag[name]) element.continue = true;
  switch (name) {
    case 'div': case 'p':
      if (attrs.align) {
        attrs.style += (';text-align:' + attrs.align);
        delete attrs.align;
      }
      break;
    case 'img':
      if (attrs['data-src']) {
        attrs.src = attrs.src || attrs['data-src'];
        delete attrs['data-src'];
      }
      var display = attrs.style.match(/display:([^;]*)/i);
      attrs.display = display ? display[1] : "inline-block";
      if (!attrs.hasOwnProperty('ignore') && attrs.src) {
        this.imgList.push(attrs.src);
        for (var item of this._tagStack) {
          if (trustTag[item.name] == Common) item.continue = true;
          else {
            if (item.name == 'a') attrs.ignore = "";
            break;
          }
        }
      };
      attrs.style = 'max-width:100%;' + attrs.style;
      break;
    case 'font':
      name = 'span';
      if (attrs.color) {
        attrs.style += (';color:' + attrs.color);
        delete attrs.color;
      }
      if (attrs.face) {
        attrs.style += (";font-family:" + attrs.face);
        delete attrs.face;
      }
      break;
    case 'a':
      element.continue = true;
      for (var item of this._tagStack) {
        if (trustTag[item.name] == Common) item.continue = true;
        else break;
      }
      attrs.style = 'color:#366092;display:inline;word-break:break-all;overflow:auto;' + attrs.style;
      break;
    case 'video': case 'audio':
      attrs.loop = attrs.hasOwnProperty('loop');
      attrs.controls = attrs.hasOwnProperty('controls');
      for (var item of this._tagStack) {
        if (trustTag[item.name] == Common) item.continue = true;
        else break;
      }
      break;
    case 'source':
      var parent = this._tagStack[this._tagStack.length - 1];
      if (parent && (parent.name == 'video' || parent.name == 'audio')) parent.attrs.src = attrs.src;
      return;
    case 'center':
      name = 'div';
      attrs.style = 'text-align:center;' + attrs.style;
      break;
    case 'pre':
      name = 'div';
      attrs.style = 'background-color:#f6f8fa;padding:5px;margin:5px 0 5px 0;border-radius:5px;font-family:monospace;white-space:pre;overflow:scroll' + attrs.style;
      break;
    case 'u':
      name = 'span';
      attrs.style = 'text-decoration:underline;' + attrs.style;
      break;
  }
  element.name = name;
  element.attrs = attrs;
  this._addDomElement(element);
  this._tagStack.push(element);
};
DomHandler.prototype.ontext = function(data) {
  var lastTag;
  if (!this._tagStack.length && this.nodes.length && (lastTag = this.nodes[this.nodes.length - 1]).type === 'text') {
    lastTag.data += data;
  } else {
    if (
      this._tagStack.length &&
      (lastTag = this._tagStack[this._tagStack.length - 1]) &&
      (lastTag = lastTag.children[lastTag.children.length - 1]) &&
      lastTag.type === 'text'
    ) {
      lastTag.data += data;
    } else {
      var element = {
        text: data,
        type: 'text'
      };
      if (/&#*((?!sp|lt|gt).){2,5};/.test(data)) {
        element.decode = true;
        var parent = this._tagStack[this._tagStack.length - 1];
        if (parent && parent.continue) delete parent.continue;
      }
      this._addDomElement(element);
    }
  }
};
DomHandler.prototype.onclosetag = function(name) {
  if (!ignoreTag[name]) this._tagStack.pop();
};
module.exports = DomHandler;
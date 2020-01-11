//Tokenizer.js
function Tokenizer(cbs) {
  this._state = "TEXT";
  this._title = "";
  this._buffer = "";
  this._sectionStart = 0;
  this._index = 0;
  this._cbs = cbs;
}
Tokenizer.prototype.TEXT = function(c) {
  var index = this._buffer.indexOf("<", this._index);
  if (index != -1) {
    this._index = index;
    var text = this._getSection();
    if (/\S/.test(text)) {
      this._cbs.ontext(text);
    }
    this._state = "BeforeTag";
    this._sectionStart = this._index;
  } else this._index = this._buffer.length;
};
Tokenizer.prototype.BeforeTag = function(c) {
  switch (c) {
    case "/":
      this._state = "BeforeCloseTag";
      break;
    case "!":
      this._state = "BeforeDeclaration";
      break;
    case "?":
      var index = this._buffer.indexOf(">", this._index);
      if (index != -1) {
        this._index = index;
        this._sectionStart = this._index + 1;
      } else this._sectionStart = this._index = this._buffer.length;
      this._state = "TEXT";
      break;
    case ">":
      this._state = "TEXT";
      break;
    case "<":
      this._cbs.ontext(this._getSection());
      this._sectionStart = this._index;
      break;
    default:
      if (/\s/.test(c)) this._state = "TEXT";
      else {
        this._state = "InTag";
        this._sectionStart = this._index;
      }
  }
};
Tokenizer.prototype.InTag = function(c) {
  if (c === "/" || c === ">" || /\s/.test(c)) {
    var tagName = this._getSection().toLowerCase();
    if (tagName == "script") {
      var index = this._buffer.indexOf("</script>", this._index);
      if (index != -1) {
        this._index = index + 8;
        this._sectionStart = this._index + 1;
      } else this._sectionStart = this._index = this._buffer.length;
      this._state = "TEXT";
    } else if(tagName=="title") {
      var index = this._buffer.indexOf("</title>", this._index);
      if (index != -1) {
        this._index = index + 7;
        var title=this._getSection().match(/>(.*?)</);
        if(title) this._title=title[1];
        this._sectionStart = this._index + 1;
      } else this._sectionStart = this._index = this._buffer.length;
      this._state = "TEXT";
    } else {
      this._emitToken("onopentagname");
      this._state = "BeforeAttrsName";
      this._index--;
    }
  }
};
Tokenizer.prototype.BeforeAttrsName = function(c) {
  if (c === ">") {
    this._cbs.onopentagend();
    this._state = "TEXT";
    this._sectionStart = this._index + 1;
  } else if (c === "/") {
    this._state = "InSelfCloseTag";
  } else if (!(/\s/.test(c))) {
    this._state = "InAttrsName";
    this._sectionStart = this._index;
  }
};
Tokenizer.prototype.InAttrsName = function(c) {
  if (c === "=" || c === "/" || c === ">" || /\s/.test(c)) {
    this._cbs.onattribname(this._getSection());
    this._sectionStart = -1;
    this._state = "AfterAttrsName";
    this._index--;
  }
};
Tokenizer.prototype.AfterAttrsName = function(c) {
  if (c === "=") {
    this._state = "BeforeAttrsValue";
  } else if (c === "/" || c === ">") {
    this._cbs.onattribend();
    this._state = "BeforeAttrsName";
    this._index--;
  } else if (!(/\s/.test(c))) {
    this._cbs.onattribend();
    this._state = "InAttrsName";
    this._sectionStart = this._index;
  }
};
Tokenizer.prototype.BeforeAttrsValue = function(c) {
  if (c === '"') {
    this._state = "InAttrsValueDQ";
    this._sectionStart = this._index + 1;
  } else if (c === "'") {
    this._state = "InAttrsValueSQ";
    this._sectionStart = this._index + 1;
  } else if (!(/\s/.test(c))) {
    this._state = "InAttrsValueNQ";
    this._sectionStart = this._index;
    this._index--;
  }
};
Tokenizer.prototype.InAttrsValueDQ = function(c) {
  if (c === '"') {
    this._emitToken("onattribdata");
    this._cbs.onattribend();
    this._state = "BeforeAttrsName";
  }
};
Tokenizer.prototype.InAttrsValueSQ = function(c) {
  if (c === "'") {
    this._emitToken("onattribdata");
    this._cbs.onattribend();
    this._state = "BeforeAttrsName";
  }
};
Tokenizer.prototype.InAttrsValueNQ = function(c) {
  if (/\s/.test(c) || c === ">") {
    this._emitToken("onattribdata");
    this._cbs.onattribend();
    this._state = "BeforeAttrsName";
    this._index--;
  }
};
Tokenizer.prototype.BeforeCloseTag = function(c) {
  if (/\s/.test(c));
  else if (c === ">") {
    this._state = "TEXT";
  } else {
    this._state = "InCloseTag";
    this._sectionStart = this._index;
  }
};
Tokenizer.prototype.InCloseTag = function(c) {
  if (c === ">" || /\s/.test(c)) {
    this._emitToken("onclosetag");
    this._state = "AfterCloseTag";
    this._index--;
  }
};
Tokenizer.prototype.InSelfCloseTag = function(c) {
  if (c === ">") {
    this._cbs.onopentagend();
    this._state = "TEXT";
    this._sectionStart = this._index + 1;
  } else if (!(/\s/.test(c))) {
    this._state = "BeforeAttrsName";
    this._index--;
  }
};
Tokenizer.prototype.AfterCloseTag = function(c) {
  if (c === ">") {
    this._state = "TEXT";
    this._sectionStart = this._index + 1;
  }
};
Tokenizer.prototype.BeforeDeclaration = function(c) {
  if (c == '-') this._state = "InComment";
  else if (c == '[') this._state = "BeforeCDATA1";
  else this._state = "InDeclaration";
};
Tokenizer.prototype.InDeclaration = function(c) {
  var index = this._buffer.indexOf(">", this._index);
  if (index != -1) {
    this._index = index;
    this._sectionStart = index + 1;
  } else this._sectionStart = this._index = this._buffer.length;
  this._state = "TEXT";
};
Tokenizer.prototype.InComment = function(c) {
  var key = (c == '-' ? '-->' : '>');
  var index = this._buffer.indexOf(key, this._index);
  if (index != -1) {
    this._index = index + key.length - 1;
    this._sectionStart = this._index + 1;
  } else this._sectionStart = this._index = this._buffer.length;
  this._state = "TEXT";
};
Tokenizer.prototype.BeforeCDATA1 = function(c) {
  if (c == 'C') this._state = "BeforeCDATA2";
  else this._state = "InDeclaration";
};
Tokenizer.prototype.BeforeCDATA2 = function(c) {
  if (c == 'D') this._state = "BeforeCDATA3";
  else this._state = "InDeclaration";
};
Tokenizer.prototype.BeforeCDATA3 = function(c) {
  if (c == 'A') this._state = "BeforeCDATA4";
  else this._state = "InDeclaration";
};
Tokenizer.prototype.BeforeCDATA4 = function(c) {
  if (c == 'T') this._state = "BeforeCDATA5";
  else this._state = "InDeclaration";
};
Tokenizer.prototype.BeforeCDATA5 = function(c) {
  if (c == 'A') this._state = "InCDATA";
  else this._state = "InDeclaration";
};
Tokenizer.prototype.InCDATA = function(c) {
  var key = (c == '[' ? ']]>' : '>');
  var index = this._buffer.indexOf(key, this._index);
  if (index != -1) {
    this._index = index + key.length - 1;
    this._sectionStart = this._index + 1;
  } else this._sectionStart = this._index = this._buffer.length;
  this._state = "TEXT";
};
Tokenizer.prototype.parse = function(chunk) {
  this._buffer += chunk;
  while (this._index < this._buffer.length) {
    this[this._state](this._buffer.charAt(this._index));
    this._index++;
  }
  if (this._state === "TEXT" && this._sectionStart !== this._index)
    this._cbs.ontext(this._buffer.substr(this._sectionStart));
  this._cbs.onend();
};
Tokenizer.prototype._getSection = function() {
  return this._buffer.substring(this._sectionStart, this._index);
};
Tokenizer.prototype._emitToken = function(name) {
  this._cbs[name](this._getSection());
  this._sectionStart = -1;
};
module.exports = Tokenizer;
/**
 * view => model
 * 解析元素，添加订阅者
 */

import * as _ from './util';
import Watcher from './watcher';

export default function (ele, vm) {
  new Compile(ele, vm);
}

class Compile {
  constructor(ele, vm) {
    this.ele = document.querySelector(ele);
    this.vm = vm;
    this.fragment = null;
    this.init();
  }

  init() {
    if (this.ele) {
      this.fragment = this.nodeToFragment();
      this.compileElement(this.fragment);
      this.ele.appendChild(this.fragment);
    } else {
      console.error('can\'t select ele');
    }
  }

  nodeToFragment() {
    var fragment = document.createDocumentFragment();
    var child = this.ele.firstChild; // https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild
    while (child) {
      // a text node is inserted to maintain the whitespace between the end of the opening <p> and <span> tags. Any whitespace will create a #text node, from a single space to multiple spaces, returns, tabs, and so on.Another #text node is inserted between the closing </span> and </p>tags.
      // node.nodeType = Node.DOCUMENT_TYPE_NODE = 3
      // 将Dom元素移入fragment中 , appenfChild => child将会在el中被移除
      fragment.appendChild(child);
      child = this.ele.firstChild;
    }
    return fragment;
  }

  compileElement(ele) {
    let childNodes = ele.childNodes;
    let _this = this;

    _.each([].slice.call(childNodes), (node) => {
      let reg = /\{\{(.*)\}\}/;
      let text = node.textContent;

      if (_this.isElementNode(node)) {  
          _this.compile(node);
      } else if (_this.isTextNode(node) && reg.test(text)) {
          // eg: {{}}
          _this.compileText(node, reg.exec(text)[1]);
      }

      if (node.childNodes && node.childNodes.length) {
          _this.compileElement(node);
      }
    });
  }

  compileText(node, exp) {
    let _this = this;
    let initText = this.vm[exp];
    this.updateText(node, initText);

    new Watcher(this.vm, exp, (val) => {
      _this.updateText(node, val);
    });
  }

  compile(node) {
    let nodeAttrs = node.attributes;
    let _this = this;
    _.each([].slice.call(nodeAttrs), (attr) => {
      let attrName = attr.name;
      if (_this.isDirective(attrName)) {
          let exp = attr.value;
          let dir = attrName.substring(2);
          if (_this.isEventDirective(dir)) {  // 事件指令
              _this.compileEvent(node, _this.vm, exp, dir);
          } else if (_this.isModelDirective(dir)) {  // v-model 指令
              _this.compileModel(node, _this.vm, exp, dir);
          }
          node.removeAttribute(attrName);
      }
    });
  }

  compileModel(node, vm, exp, dir) {
    let _this = this;
    let val = this.vm[exp];
    this.updateModel(node, val);
    new Watcher(this.vm, exp, function (value) {
        // model => view
        _this.updateModel(node, value);
    });

    node.addEventListener('input', function(e) {
      // view变化时 => vm.data.setter => proxy => observer的setter方法 => dep.notify() => watcher.update()
      var newValue = e.target.value;
      if (val === newValue) {
        return;
      }
      _this.vm[exp] = newValue;
      val = newValue;
    });
  }

  compileEvent(node, vm, exp, dir) {
    let eventType = dir.split(':')[1];
    let cb = vm.methods && vm.methods[exp];

    if (eventType && cb) {
        node.addEventListener(eventType, cb.bind(vm), false);
    }
  }

  
  updateText(node, val) {
    if (node.textContent) {
      // textContent often has better performance because the text is not parsed as HTML. Moreover, using textContent can prevent XSS attacks.
      node.textContent = val;
    } else {
      // IE
      node.nodeValue = val; 
    }    
  }

  updateModel(node, val) {
    return node.value = _.isUndefined(val) ? '' : val;
  }

  isDirective(attr) {
    return attr.indexOf('v-') == 0;
  }

  isEventDirective(dir) {
      return dir.indexOf('on:') === 0;
  }

  isModelDirective(dir) {
    return dir.indexOf('model') === 0;
  }

  isElementNode(node) {
      return node.nodeType == 1;
  }

  isTextNode(node) {
      return node.nodeType == 3;
  }

}
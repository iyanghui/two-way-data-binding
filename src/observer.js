/**
 * model => view
 * 监听器，监听属性变化 => dep.notidy() => wacher.update()
 */

import * as _ from './util';
import Dept from './dep';

export default function observe(data) {
  if (!_.isObject(data)) {
    return;
  }
  new Observer(data);
};

class Observer {
  constructor(data) {
    this.data = data;
    this.walk();
  }

  walk() {
    let _this = this;
    _.each(this.data, (v, k) => {
      _this.defineReactNative(_this.data, k, v);
    })
  }

  defineReactNative(data, key, value) {
    let dep = new Dept();
    let child = observe(value);
    
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: true,
      get: function() {
        if (Dept.target) {
          dep.addSub(Dept.target);
        }
        return value;
      },
      set: function(newVal) {
        if (newVal === value) {
          return;
        }
        value = newVal;
        dep.notify();
      }
    })

  }
}



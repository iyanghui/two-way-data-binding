/**
 * 订阅者容器
 * 1. 收集订阅者，在属性变化时执行对应订阅者的update函数
 * 2. 所有注册的观察者
 */

import * as _ from './util';

export default class Dept {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    _.each(this.subs, (sub) => {
      sub.update();
    })
  }
}

// static target = null
Dept.prototype.target = null;
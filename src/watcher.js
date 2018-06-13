/**
 * 订阅者
 * 1. 接收到订阅者容器notify后，执行相应的函数，更新view
 */

import Dept from "./dep";

export default class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    // 将自己添加到订阅器
    this.value = this.get();
  }

  get() {
    // 手动执行监听器中的getter,增加至订阅者容器
    Dept.target = this;
    let value = this.vm.data[this.exp];
    Dept.target = null;
    return value;
  }

  update() {
    let value = this.vm.data[this.exp];
    let oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  }

}
import * as _ from './util';
import observe from './observer';
import compile from './compile';

export default class SimVue {
  constructor(options) {
    this.data = options.data;
    this.methods = options.methods;

    //vm[key] => vm.data[key]
    let _this = this; 
    _.each(this.data, (v, k) => {
      _this.proxyKey(k);
    });

    observe(this.data);
    compile(options.el, this);
  }

  proxyKey(key) {
    let _this = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function() {
        return _this.data[key];
      },
      set: function(newVal) {
        _this.data[key] = newVal;
      }
    })
  }

}
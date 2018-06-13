import SimVue from './src/simVue';

new SimVue({
  el: '#app',
  data: {
      title: 'hello world',
      name: 'sim-vue'
  },
  methods: {
      clickMe: function () {
          this.title = 'world, hello';
      }
  },
  mounted: function () {
      window.setTimeout(() => {
          this.title = '你好';
      }, 1000);
  }
});
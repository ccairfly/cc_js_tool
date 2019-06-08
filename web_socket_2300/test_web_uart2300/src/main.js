import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueResource from 'vue-resource'
// import axios from 'axios';

import Vue from 'vue'
import App from './App.vue'

// import { Button, Select } from 'element-ui';
// Vue.use(Button)
// Vue.use(Select)

Vue.use(ElementUI);
Vue.use(VueResource)
// Vue.prototype.$axios = axios;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

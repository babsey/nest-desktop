import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

import combineURLs from 'axios/lib/helpers/combineURLs';

import router from './router';
import vuetify from './plugins/vuetify';
import './plugins/codemirror';

// Style
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

// Composition API
import VueCompositionAPI from '@vue/composition-api';
Vue.use(VueCompositionAPI);

// Toast notification
import VueToast from 'vue-toast-notification';
// import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast);

// Production
Vue.config.productionTip = false;

import Keycloak from 'keycloak-js';

/**
 * Mount application.
 */
const mountApp = () => {
  new Vue({
    router,
    vuetify,
    render: h => h(App),
  }).$mount('#app');
};

/**
 * Initialize
 */
const init = () => {
  fetch(combineURLs(process.env.BASE_URL, 'config/auth.json'))
    .then(response => response.json())
    .then(authConfig => {
      console.log(authConfig);
      if (authConfig.openIDConnect) {
        const keycloak = new Keycloak(authConfig.openIDConnect);
        keycloak
          .init(authConfig.keyCloakInitOptions)
          .then(auth => {
            console.info(auth ? 'Authenticated' : 'Not authenticated');
          })
          .catch(() => {
            console.error('Authentication failed');
          })
          .finally(mountApp);
      } else {
        mountApp();
      }
    })
    .catch(() => {
      mountApp();
    });
};

if (process.env.IS_ELECTRON) {
  Vue.prototype.$appConfig = {
    insiteAccess: { url: 'http://localhost:8080' },
    nestSimulator: { url: 'http://localhost:5000' },
  };
  init();
} else {
  // Load the data from config/app.json for the global config and mount the app.
  fetch(combineURLs(process.env.BASE_URL, 'config/app.json'))
    .then(response => response.json())
    .then(appConfig => (Vue.prototype.$appConfig = appConfig))
    .finally(init);
}

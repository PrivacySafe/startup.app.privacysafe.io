/*
 Copyright (C) 2024 3NSoft Inc.

 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/views/app.vue';
import { router } from '@/router';
import {
  i18n,
  I18nOptions,
  storeI18n,
} from '@v1nt1248/3nclient-lib/plugins';

import '@v1nt1248/3nclient-lib/style.css';
import '@v1nt1248/3nclient-lib/variables.css';
import '@/assets/styles/main.css';

import en from '@/data/i18/en.json';

async function init(): Promise<void> {

  const pinia = createPinia();
  pinia.use(storeI18n);

  const app = createApp(App);

  app
    .use(pinia)
    .use<I18nOptions>(i18n, { lang: 'en', messages: { en } })
    .use(router)
    .mount('#main');
}

init();
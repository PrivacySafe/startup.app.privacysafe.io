/*
 Copyright (C) 2024 3NSoft Inc.

 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import SignIn from '@/views/sign-in.vue';
import SelectProvider from '@/views/signup/select-provider.vue';
import CustomProvider from '@/views/signup/custom-provider.vue';
import UsernameEntry from '@/views/signup/username-entry.vue';
import PasswordEntry from '@/views/signup/password-entry.vue';
import Acknowledgments from '@/views/signup/acknowledgments.vue';
import SignUpProgress from '@/views/signup/progress.vue';
import PostLoginSplashscreen from '@/views/post-login-splashscreen.vue'

const routes: RouteRecordRaw[] = [
  { path: '/:catchAll(.*)', redirect: '/signin' },

  { path: '/signin', component: SignIn },

  { path: '/signup/select-provider', component: SelectProvider },

  { path: '/signup/custom-provider/1', component: CustomProvider },
  {
    path: '/signup/custom-provider/2',
    component: UsernameEntry,
    props: { currentStep: 2, totalSteps: 4 }
  },
  {
    path: '/signup/custom-provider/3',
    component: PasswordEntry,
    props: { currentStep: 3, totalSteps: 4 }
  },
  {
    path: '/signup/custom-provider/4',
    component: Acknowledgments,
    props: { currentStep: 4, totalSteps: 4 }
  },

  {
    path: '/signup/privacysafe-provider/1',
    component: UsernameEntry,
    props: { currentStep: 1, totalSteps: 3 }
  },
  {
    path: '/signup/privacysafe-provider/2',
    component: PasswordEntry,
    props: { currentStep: 2, totalSteps: 3 }
  },
  { path: '/signup/privacysafe-provider/3',
    component: Acknowledgments,
    props: { currentStep: 3, totalSteps: 3 }
  },

  { path: '/signup/progress', component: SignUpProgress },

  { path: '/post-login', component: PostLoginSplashscreen }

];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

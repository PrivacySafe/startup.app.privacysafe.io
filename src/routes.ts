/*
 Copyright (C) 2024 - 2026 3NSoft Inc.

 This program is free software: you can redistribute it and/or modify it under
 the terms of the GNU General Public License as published by the Free Software
 Foundation, either version 3 of the License, or (at your option) any later
 version.

 This program is distributed in the hope that it will be useful, but
 WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 this program. If not, see <http://www.gnu.org/licenses/>.
*/
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { APP_ROUTES } from '@/constants';
import Signin from '@/pages/signin.vue';
import Signup from '@/pages/signup.vue';
import PostLoginSplashscreen from '@/pages/post-login-splashscreen.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/signin' },
  { path: '/signin', name: APP_ROUTES.SIGNIN, component: Signin },
  { path: '/signup', name: APP_ROUTES.SIGNUP, component: Signup },
  { path: '/post-login', name: APP_ROUTES.POSTLOGIN, component: PostLoginSplashscreen },
  { path: '/:catchAll(.*)', redirect: '/signin' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

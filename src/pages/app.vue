<!--
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
-->
<script lang="ts" setup>
  import { onBeforeMount } from 'vue';
  import prLogo from '@/assets/images/privacysafe-logo.svg';
  import { useLoggedInUserStore } from '@/stores/logged-in-user.store';
  import { useSignupStore } from '@/stores/signup.store';
  import { useBootEventsStore } from '@/stores/boot-events.store';

  const bootEventsStore = useBootEventsStore();
  bootEventsStore.startWatchBoot();

  const loggedInUserStore = useLoggedInUserStore();

  const signupStore = useSignupStore();
  const { initStandard } = signupStore;

  onBeforeMount(async () => {
    await loggedInUserStore.loadUsersFromDisk();
    await initStandard();
  });
</script>

<template>
  <section :class="$style.app">
    <div :class="$style.header">
      <img
        :src="prLogo"
        alt="logo"
        :class="$style.appLogo"
      />
    </div>

    <div :class="$style.body">
      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </section>
</template>

<style lang="scss" module>
  .app {
    --app-header-height: 64px;

    position: fixed;
    inset: 0;
    background-color: var(--color-bg-block-primary-default);
    color: var(--color-text-block-primary-default);
  }

  .header {
    display: flex;
    width: 100%;
    height: var(--app-header-height);
    justify-content: center;
    align-items: center;
    padding-top: 4px;
  }

  .appLogo {
    height: 32px;
  }

  .body {
    position: relative;
    width: 100%;
    height: calc(100% - var(--app-header-height));
  }
</style>

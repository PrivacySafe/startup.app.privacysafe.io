<!--
 Copyright (C) 2024 3NSoft Inc.

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
import { useLoggedInUserStore } from '@/store';
import { computed } from 'vue';

const loggedIn = useLoggedInUserStore();
const title = computed(() => `${ loggedIn.userId }`);

</script>

<template>
  <div :class=$style.info>
    <h3>
      Opening PrivacySafe for
    </h3>
    {{ title }}

  </div>
</template>

<style lang="scss" module>
.info {
  background-color: var(--color-bg-block-primary-default);
  color: var(--color-text-block-primary-default);
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  padding-right: var(--spacing-m);
  padding-left: var(--spacing-m);
}

</style>

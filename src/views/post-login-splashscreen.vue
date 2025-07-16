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
import { useBootEvents, useLoggedInUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const loggedIn = useLoggedInUserStore();
const user = computed(() => `${ loggedIn.userId }`);
const { eventsLog } = storeToRefs(useBootEvents());

</script>

<template>
  <div :class=$style.info>
    <h3>
      {{ $tr('boot-screen.title.txt') }}
    </h3>
    {{ user }}

    <div :class="$style.logs">
      <p
        v-for="log in eventsLog"
        :class="(log.isError ? $style.errorLog : (log.isWarning ? $style.warningLog : $style.okLog))"
      >
        <span :class="$style.appName"
        >
          {{ log.coreApp ? log.coreApp+':' : '' }}
        </span>
        <br v-if="!!log.coreApp">
        {{ log.message }}
      </p>
    </div>

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

.logs {
  margin-top: var(--spacing-m);
  padding-left: var(--spacing-s);
  background-color: black;
  overflow-y: scroll;
  position: relative;
  height: 70%;
}

.errorLog {
  color: red;
}

.warningLog {
  color: darkgoldenrod;
}

.okLog {
  color: cyan;
}

.appName {
  color: white;
  font-style: italic;
  font-size: small;
}

</style>

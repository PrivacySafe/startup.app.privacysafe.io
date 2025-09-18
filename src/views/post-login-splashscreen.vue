<!--
 Copyright (C) 2024 - 2025 3NSoft Inc.

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
import { Ui3nButton, Ui3nProgressLinear } from '@v1nt1248/3nclient-lib';
import { useBootEvents, useLoggedInUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const loggedIn = useLoggedInUserStore();
const user = computed(() => `${ loggedIn.userId }`);
const { eventsLog } = storeToRefs(useBootEvents());

const showLogs = ref(false);

const NUM_OF_LOGS_ON_A_GOOD_DAY = 8;
const progressPercent = computed(() => {
  const indexOfError = eventsLog.value.findIndex(entry => !!entry.isError);
  const startCountInd = indexOfError + 1;
  const numOfLogs = eventsLog.value.length - startCountInd;
  return Math.min(Math.floor(100/NUM_OF_LOGS_ON_A_GOOD_DAY * numOfLogs), 95);
});

</script>

<template>
  <div :class=$style.info>
    <h3>
      {{ $tr('boot-screen.title.txt') }}
    </h3>
    {{ user }}

    <div
      v-if="showLogs"
      :class="$style.logs"
    >
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
    <div
      v-else
      :class="$style.progress"
    >
      <ui3n-progress-linear
        height="5"
        with-text
        :value="progressPercent"
      />

      <ui3n-button
        type="tertiary"
        @click="showLogs = true"
      >
        {{  $tr('boot-screen.show-logs.btn.txt')  }}
      </ui3n-button>
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

.progress {
  margin-top: vat(--spacing-m);
}

</style>

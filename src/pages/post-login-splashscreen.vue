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
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  import { Ui3nProgressLinear } from '@v1nt1248/3nclient-lib';
  import { useBootEventsStore } from '@/stores/boot-events.store';
  import { useLoggedInUserStore } from '@/stores/logged-in-user.store';

  const NUM_OF_LOGS_ON_A_GOOD_DAY = 8;

  const { t } = useI18n();

  const { userId: user } = storeToRefs(useLoggedInUserStore());
  const { eventsLog } = storeToRefs(useBootEventsStore());

  const showLogs = ref(false);

  const progressPercent = computed(() => {
    const indexOfError = eventsLog.value.findIndex(entry => !!entry.isError);
    const startCountInd = indexOfError + 1;
    const numOfLogs = eventsLog.value.length - startCountInd;
    return Math.min(Math.floor((100 / NUM_OF_LOGS_ON_A_GOOD_DAY) * numOfLogs), 95);
  });
</script>

<template>
  <div :class="$style.info">
    <h3 :class="$style.title">
      {{ t('boot-screen.title.txt') }}
    </h3>

    <div :class="$style.user">
      {{ user }}
    </div>

    <div :class="$style.progress">
      <ui3n-progress-linear
        height="5"
        with-text
        :value="progressPercent"
      />
    </div>

    <details
      v-if="eventsLog && Array.isArray(eventsLog) && eventsLog.length"
      :class="$style.logs"
    >
      <summary @click="showLogs = !showLogs">
        {{ showLogs ? t('boot-screen.logs.btn_hide') : t('boot-screen.logs.btn_show') }}
      </summary>

      <div :class="$style.logsContent">
        <template
          v-for="log in eventsLog"
          :key="log.message"
        >
          <div
            v-if="log.coreApp"
            :class="[$style.log, log.isError ? $style.errorLog : log.isWarning ? $style.warningLog : $style.okLog]"
          >
            <span :class="$style.appName">{{ log.coreApp }}:</span>
            <span>{{ log.message }}</span>
          </div>
        </template>
      </div>
    </details>
  </div>
</template>

<style lang="scss" module>
  .info {
    position: relative;
    height: 100%;
    width: 100%;
    padding: var(--spacing-m);

    .title {
      font-size: var(--font-20);
      font-weight: 500;
      line-height: 1;
      color: var(--color-text-block-primary-default);
      text-align: center;
      padding-top: var(--spacing-s);
      margin-block-start: 0;
      margin-block-end: var(--spacing-s);
    }

    .user {
      position: relative;
      width: 100%;
      height: var(--spacing-m);
      font-size: var(--font-13);
      font-weight: 500;
      line-height: var(--font-16);
      color: var(--color-text-control-primary-default);
      text-align: center;
      margin-bottom: var(--spacing-m);
    }

    .progress {
      margin-bottom: var(--spacing-m);
    }

    .logs {
      position: relative;
      height: calc(100% - 116px);
      border: 1px solid transparent;
      overflow-y: auto;

      summary {
        position: sticky;
        top: 0;
        z-index: 2;
        list-style: none;
        display: flex;
        height: var(--spacing-l);
        justify-content: flex-start;
        align-items: center;
        column-gap: var(--spacing-s);
        font-size: var(--font-15);
        font-weight: 500;
        background-color: var(--color-bg-block-primary-default);
        color: var(--color-text-control-accent-default);
        cursor: pointer;

        &::after {
          content: '⏵';
          font-size: var(--font-18);
          line-height: 1;
          color: var(--color-text-control-accent-default);
        }

        :hover {
          color: var(--color-text-control-accent-hover);
        }
      }

      &[open] {
        summary::after {
          content: '⏷';
          font-size: var(--font-18);
          line-height: 1;
          color: var(--color-text-control-accent-default);
        }
      }

      .logsContent {
        font-size: var(--font-13);
        line-height: 1.5;
        border-bottom-left-radius: var(--spacing-s);
        border-bottom-right-radius: var(--spacing-s);
        border-left: var(--color-border-block-primary-default);
        border-right: var(--color-border-block-primary-default);
        border-bottom: var(--color-border-block-primary-default);
        padding: var(--spacing-s);

        .log {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          row-gap: var(--spacing-xs);

          &.errorLog {
            color: var(--error-content-default);
          }

          &.warningLog {
            color: var(--warning-content-default);
          }

          &.okLog {
            color: var(--info-content-default);
          }

          .appName {
            font-size: var(--font-12);
            font-weight: 500;
            font-style: italic;
          }
        }
      }
    }
  }
</style>

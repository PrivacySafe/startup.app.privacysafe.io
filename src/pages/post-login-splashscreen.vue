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
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  import { Ui3nButton, Ui3nProgressLinear } from '@v1nt1248/3nclient-lib';
  import { useBootEventsStore } from '@/stores/boot-events.store';
  import { useLoggedInUserStore } from '@/stores/logged-in-user.store';
  import prLogo from '@/assets/images/privacysafe-logo.svg';
  import StartupFooter from '@/components/startup-footer.vue';

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
  <section>
    <div :class="$style.info">

      <div :class="$style.logoBlock">
        <img
          :src="prLogo"
          alt="PrivacySafe logo"
        />
      </div>

      <div :class="$style.progress">
        {{ `${progressPercent} %` }}
        <br>
        <ui3n-progress-linear
          height="12"
          :value="50"
          :color="'var(--signin-green)'"
        />
      </div>

      <div :class="$style.text">
        {{ t('boot-screen.txt') }}
        <br>
        {{ user }}
      </div>

      <div
        v-if="showLogs"
        :class="$style.logs"
      >
        <div :class="$style.title">
          {{ t('boot-screen.logs.summary') }}
        </div>

        <div :class="$style.logsContent">
          <template
            v-for="log in eventsLog"
            :key="log.message"
          >
            <div
              :class="[$style.log, log.isError ? $style.errorLog : log.isWarning ? $style.warningLog : $style.okLog]"
            >
              <span>{{ log.isError ? '❌' : log.isWarning ? '⚠️' : '✔️' }} </span>
              <span :class="$style.appName" v-if="!!log.coreApp">{{ log.coreApp }}:<br></span>
              <span>{{ log.message }}</span><br>
            </div>
          </template>
        </div>
      </div>
    </div>

    <startup-footer>
      <div :class="$style.footer">
        <span>🧾 </span>
        <ui3n-button
          :type="'tertiary'"
          @click="showLogs = !showLogs"
        >
          {{ t(showLogs ? 'boot-screen.logs.btn_hide' : 'boot-screen.logs.btn_show') }}
        </ui3n-button>
      </div>
    </startup-footer>

  </section>
</template>

<style lang="scss" module>
  .info {
    position: relative;
    width: 100%;
    min-height: calc(var(--spacing-xxl)*10);
    padding-left: var(--spacing-m);
    padding-right: var(--spacing-m);

    .logoBlock {
      width: 100%;
      img {
        width: 100%;
      }
      margin-top: calc(var(--spacing-xl) * 2);
    }

    .text {
      width: 100%;
      margin-top: var(--spacing-ml);
      text-align: center;
      font-size: var(--font-16);
      font-weight: 600;
      line-height: var(--font-32);
    }

    .progress {
      width: 100%;
      margin-top: var(--spacing-m);
      text-align: center;
      color: var(--signin-green);
      font-size: var(--font-16);
      font-weight: 600;
      line-height: var(--font-32);
    }

    .logs {
      margin-top: var(--spacing-m);
      margin-bottom: calc(var(--spacing-xxl)*2);

      .title {
        font-size: var(--font-15);
        font-weight: 500;
        color: var(--color-text-control-accent-default);
      }

      .logsContent {
        padding: var(--spacing-s);

        .log {
          margin-bottom: var(--spacing-s);

          .appName {
            font-size: var(--font-12);
            font-weight: 500;
            font-style: italic;
          }
        }
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      padding-right: var(--spacing-xs);
    }
  }

</style>

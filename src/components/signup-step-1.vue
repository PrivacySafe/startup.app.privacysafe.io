<!--
 Copyright (C) 2026 3NSoft Inc.

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
<script setup lang="ts">
  import { inject, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NOTIFICATIONS_KEY } from '@v1nt1248/3nclient-lib/plugins';
  import { Ui3nInput, Ui3nRipple as vUi3nRipple } from '@v1nt1248/3nclient-lib';
  import { useSignupStore } from '@/stores/signup.store';
  import { stdSignupLink, tokens } from '@/constants';
  import { parse3NWebURL, type SignupParamsViaURL } from '@/utils/signup-links';

  const emits = defineEmits<{
    (event: 'change:step', payload: { step: number; query?: Record<string, string> }): void;
  }>();

  const { t } = useI18n();
  const { $createNotice } = inject(NOTIFICATIONS_KEY)!;
  const { getDomainsFor, setStoreFieldValue } = useSignupStore();

  const customTokenOrLink = ref('');
  const isProcessing = ref(false);

  function getSignUpParams(token: string): SignupParamsViaURL | undefined {
    return parse3NWebURL(`${stdSignupLink}${token}`);
  }

  async function selectProvider(key: 'silver' | 'gold' | 'platinum') {
    try {
      isProcessing.value = true;
      const selectedToken = tokens[key].value;
      const params = getSignUpParams(selectedToken);

      if (params) {
        const { token, isStandardService } = params;
        const { domains, errMsgLabel, okMsgLabel } = await getDomainsFor(params);

        if (domains) {
          setStoreFieldValue('signupLink', selectedToken);
          setStoreFieldValue('isStandardService', !!isStandardService);
          setStoreFieldValue('srvToken', token ?? '');
          setStoreFieldValue('availableDomains', domains);
          setStoreFieldValue('userDomain', tokens[key].domain);

          $createNotice({
            type: 'success',
            content: okMsgLabel!,
          });
          emits('change:step', {
            step: 2,
            query: {
              ...(token && { token }),
              domain: tokens[key].domain,
            },
          });
          return;
        }

        $createNotice({
          type: 'error',
          content: errMsgLabel!,
        });
      }
    } finally {
      isProcessing.value = false;
    }
  }
</script>

<template>
  <div :class="$style.step1">
    <div :class="$style.main">
      <div :class="$style.row">
        <template
          v-for="(token, key) in tokens"
          :key="key"
        >
          <div
            v-ui3n-ripple
            :class="[$style.provider, isProcessing && $style.disabled, $style[`${key}-provider`]]"
            @click="() => selectProvider(key)"
          >
            <span :class="$style.providerTitle">{{ t(`signup.provider.${key}.title`) }}</span>
            <span :class="$style.providerInfo">{{
              t(`signup.provider.${key}.info`, { domain: `@${token.domain}` })
            }}</span>
          </div>
        </template>
      </div>
    </div>

    <div :class="[$style.row, $style.input]">
      <span :class="$style.rowLabel">
        <span>{{ t('signup.provider.enter_label.part_1') }}</span>
        <span :class="$style.highlight">{{ t('signup.provider.enter_label.part_2') }}</span>
        <span>{{ t('signup.provider.enter_label.part_3') }}</span>
      </span>

      <ui3n-input
        v-model="customTokenOrLink"
        hide-bottom-space
        :disabled="isProcessing"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
  .step1 {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .row {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-m);

    &.input {
      row-gap: var(--spacing-xs);
    }

    .rowLabel {
      text-align: center;
      font-size: var(--font-12);
      font-weight: 500;
      line-height: 1;
      padding-bottom: 2px;

      .highlight {
        color: var(--color-text-block-accent-default);
      }
    }
  }

  .main {
    position: relative;
    width: 100%;
    height: 260px;
    margin-bottom: var(--spacing-l);
  }

  .provider {
    position: relative;
    width: 46%;
    aspect-ratio: 5 / 2;
    padding: var(--spacing-xs);
    overflow: hidden;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: var(--spacing-s);
    border: 1.5px solid color-mix(in oklch, var(--default-fill-default), transparent 80%);
    color: var(--white-100);
    text-shadow: 0 1px 2px oklch(0% 0 0 / 0.4);
    line-height: 1;
    cursor: pointer;
    transition: 0.3s ease;

    .providerTitle {
      font-size: var(--font-15);
      font-weight: 600;
    }

    .providerInfo {
      font-size: var(--font-10);
      font-weight: 400;
    }

    &.silver-provider {
      background: linear-gradient(135deg, oklch(78% 0.07 260) 0%, oklch(50% 0.06 260) 100%);
      box-shadow:
        0 0 10px oklch(65% 0.08 260 / 0.6),
        0 0 20px oklch(65% 0.08 260 / 0.3),
        inset 0 1px 1px oklch(100% 0 0 / 0.6);
    }

    &.gold-provider {
      background: linear-gradient(135deg, oklch(82% 0.17 80) 0%, oklch(55% 0.16 80) 100%);
      box-shadow:
        0 0 10px oklch(70% 0.18 80 / 0.7),
        0 0 20px oklch(70% 0.18 80 / 0.4),
        inset 0 1px 1px oklch(100% 0 0 / 0.5);
    }

    &.platinum-provider {
      background: linear-gradient(135deg, oklch(85% 0.02 250) 0%, oklch(60% 0.03 250) 100%);
      box-shadow:
        0 0 12px oklch(80% 0.03 250 / 0.8),
        0 0 24px oklch(80% 0.03 250 / 0.4),
        inset 0 1px 1px oklch(100% 0 0 / 0.8);
      text-shadow: 0 1px 3px oklch(0% 0 0 / 0.5);
    }

    &:not(.disabled):hover {
      border-color: var(--default-fill-default);
      transition: 0.3s ease;
      filter: brightness(1.1);
    }

    &.disabled {
      pointer-events: none;
      cursor: default;
    }
  }
</style>

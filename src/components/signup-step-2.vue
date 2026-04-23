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
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { Ui3nButton, Ui3nInput } from '@v1nt1248/3nclient-lib';
  import { useSignupStore } from '@/stores/signup.store';
  import { areAddressesEqual } from '@/utils/canonical-address';

  const emits = defineEmits<{
    (event: 'change:step', payload: { step: number; query?: Record<string, string> }): void;
  }>();

  const { t } = useI18n();
  const route = useRoute();

  const signupStore = useSignupStore();
  const { userDomain, srvToken } = storeToRefs(signupStore);
  const { setStoreFieldValue } = signupStore;

  if (route.query.token && !srvToken.value) {
    setStoreFieldValue('srvToken', route.query.token as string);
  }

  if (route.query.domain && !userDomain.value) {
    setStoreFieldValue('userDomain', route.query.domain as string);
  }

  const usernameValidationRules = [
    (v: unknown) => !!v || t('err.field_required'),
    (v: unknown) => ((v as string).length >= 6 && (v as string).length <= 60) || t('err.login_length'),
    (v: unknown) => /^[\p{L}\p{N}._-]+$/u.test(v as string) || t('err.login_characters'),
  ];

  const username = ref('');
  const externalUsernameError = ref('');
  const isLoginValid = ref(false);
  const isProcessing = ref(false);

  const isFormValid = computed(() => isLoginValid.value && !externalUsernameError.value);

  function onUsernameUpdate() {
    if (externalUsernameError.value) {
      externalUsernameError.value = '';
    }
  }

  async function checkNewLoginAvailability() {
    try {
      isProcessing.value = true;
      const token = srvToken.value || undefined;
      const availableAddresses = await w3n.signUp.getAvailableAddresses(username.value, token);

      const currentAddr = `${username.value}@${userDomain.value}`;
      if (availableAddresses.find(addr => areAddressesEqual(addr, currentAddr))) {
        setStoreFieldValue('username', username.value);
        setStoreFieldValue('address', currentAddr);
        emits('change:step', { step: 3 });
        return;
      } else {
        externalUsernameError.value = t('signup.step.create_user.status.addr_not_available', {
          address: currentAddr,
        });
      }
    } finally {
      isProcessing.value = false;
    }
  }
</script>

<template>
  <div :class="$style.step2">
    <div :class="$style.main">
      <div :class="$style.text">
        {{ t('signup.step.create_user.txt') }}
      </div>

      <div :class="$style.row">
        <span :class="$style.rowLabel">{{ t('signup.step.create_user.domain_label') }}:</span>
        <span :class="$style.rowValue">@{{ userDomain }}</span>
      </div>

      <ui3n-input
        v-model="username"
        :label="t('field.label.login')"
        :placeholder="t('signup.step.create_user.login_placeholder')"
        :rules="usernameValidationRules"
        :display-state-mode="!!externalUsernameError ? 'error' : undefined"
        :display-state-message="externalUsernameError"
        :disabled="isProcessing"
        @update:model-value="onUsernameUpdate"
        @update:valid="isLoginValid = $event"
      />
    </div>

    <ui3n-button
      block
      :disabled="!isFormValid || isProcessing"
      :class="$style.nextBtn"
      @click="checkNewLoginAvailability"
    >
      {{ t('signup.step.btn.next') }}
    </ui3n-button>
  </div>
</template>

<style lang="scss" module>
  .step2 {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .main {
      position: relative;
      width: 100%;
      height: 260px;
      margin-bottom: var(--spacing-l);
    }

    .text {
      display: inline-block;
      font-size: var(--font-13);
      font-weight: 400;
      line-height: 1.5;
      margin-bottom: var(--spacing-ml);
    }

    .row {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-m);

      .rowLabel {
        font-size: var(--font-14);
        font-weight: 500;
        line-height: var(--font-20);
      }

      .rowValue {
        font-size: var(--font-13);
        font-weight: 600;
        line-height: var(--font-16);
        color: var(--color-text-block-accent-default);
      }
    }

    .nextBtn {
      height: var(--spacing-xl);
      border-radius: var(--spacing-s);

      span {
        font-size: var(--font-14);
      }
    }
  }
</style>

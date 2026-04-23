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
  import { useSignupStore } from '@/stores/signup.store';
  import { Ui3nButton, Ui3nInput } from '@v1nt1248/3nclient-lib';

  const validPasswordSymbols = '! # * $ % & ( ) + - : ; ? . @ ^ _ ~ ';

  const emits = defineEmits<{
    (event: 'change:step', payload: { step: number; query?: Record<string, string> }): void;
  }>();

  const { t } = useI18n();
  const { setStoreFieldValue } = useSignupStore();

  const form = ref({
    password: {
      txt: '',
      isTouched: false,
      errorMessage: '',
    },
    confirmation: {
      txt: '',
      isTouched: false,
      errorMessage: '',
    },
  });

  const isFormValid = computed(() => !form.value.password.errorMessage && !form.value.confirmation.errorMessage);

  const passwordValidationRules = [
    (v: string) => !!v || t('err.field_required'),
    (v: string) => /^[\p{L}\d!#*$%&()+\-:;?.@^_~]+$/u.test(v) || t('err.password_characters'),
    (v: string) => v.trim().length >= 12 || t('err.password_length'),
  ];

  const confirmationValidationRules = [(v: string) => v === form.value.password.txt || t('err.confirmation_err')];

  function validate(field: 'password' | 'confirmation', value: string): void {
    form.value[field].errorMessage = '';
    const rules = field === 'password' ? passwordValidationRules : confirmationValidationRules;
    for (const rule of rules) {
      const res = rule(value);
      if (typeof res === 'string') {
        form.value[field].errorMessage += res;
      }
    }
  }

  function onFieldUpdate(field: 'password' | 'confirmation', value: string): void {
    if (!form.value[field].isTouched) {
      form.value[field].isTouched = true;
    }

    validate(field, value);
  }

  function confirmPassword() {
    if (!isFormValid.value) {
      return;
    }

    setStoreFieldValue('password', form.value.password.txt);
    emits('change:step', { step: 4 });
  }
</script>

<template>
  <div :class="$style.step3">
    <div :class="$style.main">
      <div :class="$style.text">
        <span>{{ t('signup.step.create_password.txt1') }}</span>
        <span :class="$style.highlight">{{ validPasswordSymbols }}</span>
        <br />
        <span>{{ t('signup.step.create_password.txt2') }}</span>
      </div>

      <ui3n-input
        v-model="form.password.txt"
        type="password"
        :label="t('field.label.password')"
        :placeholder="t('placeholder.create_password')"
        :display-state-mode="
          form.password.isTouched && form.password.errorMessage
            ? 'error'
            : form.password.isTouched
              ? 'success'
              : undefined
        "
        :display-state-message="
          form.password.isTouched && form.password.errorMessage ? form.password.errorMessage : undefined
        "
        display-state-with-icon
        :class="$style.password"
        @update:model-value="ev => onFieldUpdate('password', ev)"
      />

      <ui3n-input
        v-model="form.confirmation.txt"
        type="password"
        :label="t('field.label.confirm_password')"
        :placeholder="t('placeholder.confirm_password')"
        :display-state-mode="
          form.confirmation.isTouched && form.confirmation.errorMessage
            ? 'error'
            : form.confirmation.isTouched
              ? 'success'
              : undefined
        "
        :display-state-message="
          form.confirmation.isTouched && form.confirmation.errorMessage
            ? form.confirmation.errorMessage
            : undefined
        "
        display-state-with-icon
        @update:model-value="ev => onFieldUpdate('confirmation', ev)"
      />
    </div>

    <ui3n-button
      block
      :disabled="!isFormValid"
      :class="$style.nextBtn"
      @click="confirmPassword"
    >
      {{ t('signup.step.btn.next') }}
    </ui3n-button>
  </div>
</template>

<style lang="scss" module>
  .step3 {
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

      .highlight {
        color: var(--color-text-block-accent-default);
      }
    }

    .password {
      margin-bottom: var(--spacing-m);
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

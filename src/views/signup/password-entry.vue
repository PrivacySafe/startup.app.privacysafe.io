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
import { ref, computed, inject } from 'vue';
import SignupStep from '@/components/signup-step.vue';
import { Ui3nInput } from '@v1nt1248/3nclient-lib';
import { useSignupStore } from '@/store';
import { I18N_KEY, I18nPlugin } from '@v1nt1248/3nclient-lib/plugins';

defineProps<{
  currentStep: number;
  totalSteps: number;
}>();

const { $tr } = inject<I18nPlugin>(I18N_KEY)!;

const signupState = useSignupStore();
signupState.password = '';
signupState.keyGenerationProc = undefined;

const password = ref('');
const passOk = ref(false);
const passErrorMsg = ref('');
const passState = computed(() => {
  if (passErrorMsg.value.length > 0) {
    return 'error';
  } else if (passOk.value) {
    return 'success';
  } else {
    return;
  }
});

const passConfirmation = ref('');
const confirmErrorMsg = ref('');
const passValuesAreSame = computed(
  () => (passOk.value && (password.value === passConfirmation.value))
);
const confirmationStatus = computed(() => {
  if (confirmErrorMsg.value.length > 0) {
    return 'error';
  } else if (passValuesAreSame.value) {
    return 'success';
  } {
    return;
  }
});

function checkPassword() {
  passOk.value = (password.value.length >= 12);
}

function showPassStatus() {
  if (passOk.value) {
    passErrorMsg.value = '';
  } else if (password.value.length < 12) {
    passErrorMsg.value = $tr('err.short_password');
  } else {
    passErrorMsg.value = $tr('err.try_other_pass');
  }
}

function onPassFocus() {
  passErrorMsg.value = '';
}

function showConfirmationStatus() {
  if (passValuesAreSame.value) {
    confirmErrorMsg.value = '';
  } else {
    confirmErrorMsg.value = $tr('err.passwords_not_same');
  }
}

function clearConfirmationStatus() {
  confirmErrorMsg.value = '';
}

function startKeyGenProcess() {
  signupState.password = password.value;
  signupState.keyGenerationProc = 0;
  w3n.signUp.createUserParams(signupState.password, p => {
    signupState.keyGenerationProc = p;
  })
  .then(() => {
    signupState.keyGenerationProc = true;
  }, err => {
    signupState.keyGenerationProc = undefined;
    console.error(`Failed to generate keys:`, err);
  });
}

</script>

<template>
  <signup-step
    :current-step=currentStep
    :total-steps=totalSteps
    :step-description="$tr('signup.step.create_password')"
    :this-step-done=passValuesAreSame
    @next=startKeyGenProcess
  >

    <div :class=$style.text>
      {{ $tr('signup.step.create_password.txt') }}
    </div>

    <div :class=$style.input>
      <ui3n-input
        type="password"
        :label="$tr('field.label.password')"
        :placeholder="$tr('placeholder.create_password')"
        v-model=password
        @focus=onPassFocus
        @input=checkPassword
        @change=showPassStatus
        :display-state-mode=passState
        display-state-with-icon
        :display-state-message=passErrorMsg
      />
    </div>

    <div :class=$style.input>
      <ui3n-input
        type="password"
        :label="$tr('field.label.confirm_password')"
        :placeholder="$tr('placeholder.confirm_password')"
        v-model=passConfirmation
        :display-state-mode=confirmationStatus
        display-state-with-icon
        :display-state-message=confirmErrorMsg
        @focus=clearConfirmationStatus
        @change=showConfirmationStatus
        @input=checkPassword
      />
    </div>

  </signup-step>
</template>

<style lang="scss" module>
.text {
  margin-top: var(--spacing-xxl);
  margin-bottom: var(--spacing-l);
  font-size: var(--font-12);
}

.input {
  margin-top: var(--spacing-m);
}
</style>

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
import { ref, computed, inject } from 'vue';
import SignupStep from '@/components/signup-step.vue';
import { Ui3nInput, Ui3nTooltip } from '@v1nt1248/3nclient-lib';
import { useSignupStore } from '@/store';
import { I18N_KEY, I18nPlugin } from '@v1nt1248/3nclient-lib/plugins';
import { useInputState } from './useInputState';
import { findIndexOfFirstDisallowedCharIn } from '@/utils/validations';
import { strictASCiiForPassword } from '@/utils/unicode-ranges';

defineProps<{
  currentStep: number;
  totalSteps: number;
}>();

const { $tr } = inject<I18nPlugin>(I18N_KEY)!;

const signupState = useSignupStore();
signupState.password = '';
signupState.keyGenerationProc = undefined;

const isCustomService = signupState.customSrvUrlWasSet;

const password = ref('');
const {
  stateMsg: passErrorMsg,
  stateMode: passState,
  setState: setPassMsg,
  clearState: clearPassMsg,
  setStateForSecs: setPassMsgForSecs
} = useInputState();
const passOk = computed(() => (passState.value === 'success'));

const MIN_PASS_LENGTH = 12;

function validatePasswordDuringInput() {
  if (isCustomService) {
    return;
  }
  const invalidCharInd = findIndexOfFirstDisallowedCharIn(
    password.value, strictASCiiForPassword
  );
  if (invalidCharInd > -1) {
    const invalidChar = password.value[invalidCharInd];
    setPassMsgForSecs(
      $tr('signup.step.create_password.status.invalid_char', {
        char: invalidChar
      }),
      'error', 3
    );
    setTimeout(() => {
      password.value = password.value.substring(0, invalidCharInd);
    });
  } else {
    if (password.value.length < MIN_PASS_LENGTH) {
      clearPassMsg();
    } else {
      setPassMsg('', 'success');
    }
  }
}

function onPassFocus() {
  validatePasswordDuringInput();
}

function validatePasswordOnChange() {
  if (password.value.length < MIN_PASS_LENGTH) {
    setPassMsg(
      $tr('signup.step.create_password.status.password_too_short'),
      'error'
    );
    return;
  }
  const invalidCharInd = findIndexOfFirstDisallowedCharIn(
    password.value, strictASCiiForPassword
  );
  if (invalidCharInd > -1) {
    const invalidChar = password.value[invalidCharInd];
    setPassMsg(
      $tr('signup.step.create_password.status.invalid_char', {
        char: invalidChar
      }),
      'error'
    );
  } else {
    setPassMsg('', 'success');
  }
}

const passConfirmation = ref('');
const passValuesAreSame = computed(
  () => (passOk.value && (password.value === passConfirmation.value))
);
const {
  stateMsg: confirmErrorMsg,
  stateMode: confirmationStatus,
  setState: setConfirmMsg,
  clearState: clearConfirmationStatus
} = useInputState();

function comparePasswords() {
  if (!passOk.value) {
    clearConfirmationStatus();
  } else if (passConfirmation.value.length > password.value.length) {
    setConfirmMsg(
      $tr('signup.step.create_password.status.passwords_not_same'),
      'error'
    );
  } else if (passConfirmation.value === password.value) {
    setConfirmMsg('', 'success');
  } else {
    clearConfirmationStatus();
  }
}

function comparePasswordsOnChange() {
  if (!passOk.value) {
    clearConfirmationStatus();
  } else if (passConfirmation.value === password.value) {
    setConfirmMsg('', 'success');
  } else {
    setConfirmMsg(
      $tr('signup.step.create_password.status.passwords_not_same'),
      'error'
    );
  }
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
      <span>{{ $tr('signup.step.create_password.txt.p1') }}</span>
      <ui3n-tooltip :class=$style.tooltip
        :content="$tr('signup.step.create_password.txt.p2.tip')"
        placement="top-end"
        trigger="hover"
      >
        {{ $tr('signup.step.create_password.txt.p2') }}
      </ui3n-tooltip>
      <span>{{ $tr('signup.step.create_password.txt.p3') }}</span>
      <ui3n-tooltip :class=$style.tooltip
        :content="$tr('signup.step.create_password.txt.p4.tip')"
        placement="top-end"
        trigger="hover"
      >
        {{ $tr('signup.step.create_password.txt.p4') }}
      </ui3n-tooltip>
      <span>{{ $tr('signup.step.create_password.txt.p5') }}</span>
    </div>

    <div :class=$style.input>
      <ui3n-input
        type="password"
        :label="$tr('field.label.password')"
        :placeholder="$tr('placeholder.create_password')"
        v-model=password
        @focus=onPassFocus
        @input=validatePasswordDuringInput
        @change=validatePasswordOnChange
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
        @change=comparePasswordsOnChange
        @input=comparePasswords
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

.tooltip {
  display: inline-block;
  text-decoration: underline;
}
.tooltip div {
  max-width: 20em;
}

.input {
  margin-top: var(--spacing-m);
}
</style>

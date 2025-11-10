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
import SignupStep from '@/components/signup-step.vue';
import { Ui3nButton, Ui3nInput, Ui3nInputProps } from '@v1nt1248/3nclient-lib';
import { useSignupStore } from '@/store';
import { computed, inject, onMounted, ref } from 'vue';
import { I18N_KEY, I18nPlugin } from '@v1nt1248/3nclient-lib/plugins';
import { SingleProc, sleep } from '@v1nt1248/3nclient-lib/utils';
import { parse3NWebURL, stdSignupLink } from '@/utils/signup-links';

defineProps<{
  currentStep: number;
  totalSteps: number;
}>();

const { $tr } = inject<I18nPlugin>(I18N_KEY)!;

const signupState = useSignupStore();

const signupLink = ref(signupState.signupLink);

const canGoNext = ref(signupState.availableDomains.length > 0);
const nextBtnTxt = computed(() => (canGoNext.value ?
  (signupState.isStandardService ?
    $tr(signupState.srvToken ? 'signup.choice.btn.privacysafe_token' : 'signup.choice.btn.privacysafe_std') :
    $tr('signup.choice.btn.custom_provider')
  ) :
  $tr('signup.choice.btn.not_available')
));

const signupLinkInputState = ref<Ui3nInputProps['displayStateMode']>();
const signupLinkInputMsg = ref('');
const checkingProcessIsOn = ref(false);

function setInProcessView() {
  canGoNext.value = false;
  signupLinkInputMsg.value = '';
  signupLinkInputState.value = undefined;
  checkingProcessIsOn.value = true;
}

function setOKView(okMsgLabel: string, labelParams: Record<string, string>|undefined) {
  signupLinkInputMsg.value = $tr(okMsgLabel, labelParams);
  signupLinkInputState.value = 'success';
  canGoNext.value = true;
  checkingProcessIsOn.value = false;
}

function setErredView(errMsgLabel: string, labelParams: Record<string, string>|undefined) {
  signupLinkInputMsg.value = $tr(errMsgLabel, labelParams);
  signupLinkInputState.value = 'error';
  canGoNext.value = false;
  checkingProcessIsOn.value = false;
}

const linkCheckProc = new SingleProc();

function inputEvent() {
  setInProcessView();
  const valueToCheck = signupLink.value;
  linkCheckProc.startOrChain(async () => {
    if (valueToCheck === signupLink.value) {
      await sleep(200);
      if (valueToCheck !== signupLink.value) {
        return;
      }
    } else {
      return;
    }
    const params = parse3NWebURL(
      (valueToCheck === '') ? stdSignupLink : valueToCheck
    );
    if (params) {
      const { token, isStandardService } = params;
      const { domains, errMsgLabel, labelParams, okMsgLabel } = await signupState.getDomainsFor(params);

      if (domains) {
        console.log(`domains are`, domains);
        signupState.signupLink = valueToCheck;
        signupState.isStandardService = !!isStandardService;
        signupState.srvToken = token ?? '';
        signupState.availableDomains = domains;
        setOKView(okMsgLabel!, labelParams);
      } else {
        console.log(`no domains`);
        setErredView(errMsgLabel!, labelParams);
      }
    } else {
      console.log(`no params`);
      setErredView('', undefined);
    }
  });
}

</script>

<template>
  <signup-step
    :current-step=currentStep
    :total-steps=totalSteps
    :step-description="$tr('signup.choice.title')"
    :this-step-done=canGoNext
    :next-btn-txt="nextBtnTxt"
  >

    <div :class="$style.text">
      {{ $tr('signup.choice.txt') }}
    </div>

    <div>

      <ui3n-input
        :class="$style.input"
        :label="$tr('signup.choice.label.singup_link')"
        v-model="signupLink"
        @input="inputEvent"
        :display-state-mode="signupLinkInputState"
        display-state-with-icon
        :display-state-message="signupLinkInputMsg"
      />

      <div :class=$style.longProcess
        v-if=checkingProcessIsOn
      >
        <ui3n-progress-linear indeterminate />
      </div>


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

.longProcess {
  font-size: var(--font-12);
  margin-top: var(--spacing-m);
}

</style>

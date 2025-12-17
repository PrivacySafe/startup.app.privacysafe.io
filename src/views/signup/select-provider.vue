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
import { Ui3nInput, Ui3nInputProps } from '@v1nt1248/3nclient-lib';
import { useSignupStore } from '@/store';
import { computed, inject, ref } from 'vue';
import { I18N_KEY, I18nPlugin } from '@v1nt1248/3nclient-lib/plugins';
import { SingleProc, sleep } from '@v1nt1248/3nclient-lib/utils';
import { parse3NWebURL, SignupParamsViaURL, stdSignupLink } from '@/utils/signup-links';
import { router } from '@/router';

const props = defineProps<{
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
    for (const { hook, url } of Object.values(stagingProviderSites)) {
      if (valueToCheck === hook) {
        return await openProviderSite(url);
      }
    }
    await processSignupTokenOrURL(valueToCheck);
  });
}

async function processSignupTokenOrURL(valueToCheck: string, moveToNextOnOK = false) {
  let params: SignupParamsViaURL|undefined = undefined;
  if (valueToCheck === '') {
    params = parse3NWebURL(stdSignupLink);
  } else if (valueToCheck.includes('/')) {
    params = parse3NWebURL(valueToCheck);
  } else {
    params = parse3NWebURL(stdSignupLink+valueToCheck);
  }
  if (params) {
    const { token, isStandardService } = params;
    const { domains, errMsgLabel, labelParams, okMsgLabel } = await signupState.getDomainsFor(params);

    if (domains) {
      signupState.signupLink = valueToCheck;
      signupState.isStandardService = !!isStandardService;
      signupState.srvToken = token ?? '';
      signupState.availableDomains = domains;
      setOKView(okMsgLabel!, labelParams);
      if (moveToNextOnOK) {
        let path = location.pathname;
        path = `${path.substring(0, path.length-1)}${props.currentStep+1}`;
        router.push({ path });
      }
    } else {
      setErredView(errMsgLabel!, labelParams);
    }
  } else {
    setErredView('', undefined);
  }
}

const stagingProviderSites = [
  {
    hook: `staging-site-1`,
    url: `https://download.privacysafe.app/`
  },
  {
    hook: `staging-site-2`,
    url: `https://ivycyber.com/shop/`
  },
  {
    hook: `staging-site-unknown-path`,
    url: `https://download.privacysafe.app/wrong/path/`
  },
  {
    hook: `staging-site-wrong-host`,
    url: `https://download.privacysafe.app:404/`
  },
  {
    hook: `staging-site-unknown-host`,
    url: `https://unknown-host.privacysafe.app/`
  }
];

async function openProviderSite(url: string) {
  try {
    await w3n.provider.openSiteInChildWindow(url)
    .catch(err => {
      console.error(`opening site erred`, err);
      throw err;
    });
    console.log(`window with ${url} should be opened`);

    console.log(`waiting for token ...`);
    const token = await w3n.provider.getSignupToken()
    .catch(err => {
      console.error(`waiting for token erred`, err);
      throw err;
    });
    console.log(`token:`, token);

    signupLink.value = token;
    await processSignupTokenOrURL(token, true);

  } catch (err) {
    console.log(`Wiping signupLink entry`);
    signupLink.value = '';
    inputEvent();
  } finally {
    w3n.provider.closeSite();
  }
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

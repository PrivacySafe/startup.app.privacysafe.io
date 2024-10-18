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
import { computed, inject, ref } from 'vue';
import SignupStep from '@/components/signup-step.vue';
import { Ui3nInput, Ui3nInputProps, Ui3nProgressLinear } from '@v1nt1248/3nclient-lib';
import { useSignupStore } from '@/store';
import { I18N_KEY, I18nPlugin } from '@v1nt1248/3nclient-lib/plugins';

type ConnectException = web3n.ConnectException;
type HTTPException = web3n.HTTPException;

const { $tr } = inject<I18nPlugin>(I18N_KEY)!;

const signupState = useSignupStore();

const haveDomain = computed(() => (signupState.availableDomains.length > 0));

const customSrvUrl = ref(signupState.customSrvUrl);
const srvUrlErrMsg = ref('');
const srvUrlInputState = ref<Ui3nInputProps['displayStateMode']>();

const optToken = ref(signupState.srvToken);
const tokenMsg = ref('');
const tokenInputState = ref<Ui3nInputProps['displayStateMode']>();

function clearErrMsgs() {
  srvUrlErrMsg.value = '';
  srvUrlInputState.value = undefined;
  tokenMsg.value = '';
  tokenInputState.value = undefined;
}

const longPeriodMillis = 500;

const needDivForLongProcess = ref(false);
const longProcessTxt = ref('');
const domainsCheckingProcessTS = ref<number|undefined>();
function setDomainsCheckingProcessTS(url: string): number {
  const ts = Date.now();
  domainsCheckingProcessTS.value = ts;
  setTimeout(() => {
    if (domainsCheckingProcessTS.value !== ts) {
      return;
    }
    needDivForLongProcess.value = true;
    refreshLongProcessText(url);
    const refreshId = setInterval(() => {
      if (domainsCheckingProcessTS.value !== ts) {
        clearInterval(refreshId);
        return;
      }
      refreshLongProcessText(url);
    }, 100);

  }, longPeriodMillis);
  return ts;
}
function refreshLongProcessText(url: string) {
  const millis = Date.now() - domainsCheckingProcessTS.value!;
  longProcessTxt.value = $tr('signup.step.custom_provider.long_process', {
    url, seconds: `${Math.floor(millis/1000)}`
  });
}
function clearDomainsCheckingProcess(ts: number) {
  if (domainsCheckingProcessTS.value === ts) {
    domainsCheckingProcessTS.value = undefined;
    needDivForLongProcess.value = false;
    longProcessTxt.value = '';
  }
}

async function getDomainsFromCustomService() {
  let url = customSrvUrl.value;
  if (!url) {
    return;
  } else if (!url.startsWith(`https://`)) {
    url = `https://${url}`;
  }
  const thisCheckTS = setDomainsCheckingProcessTS(url);
  try {
    signupState.availableDomains = [];
    await w3n.signUp.setSignUpServer(url);
    signupState.customSrvUrlWasSet = true;
    try {
      const token = (optToken.value ? optToken.value : undefined);
      const domains = await w3n.signUp.getAvailableDomains(token);
      if (domains.length > 0) {
        signupState.availableDomains = domains;
        signupState.customSrvUrl = url;
        if (token) {
          signupState.srvToken = token;
        }
        srvUrlInputState.value = 'success';
        tokenInputState.value = 'success';
        tokenMsg.value = $tr(token ?
          'signup.step.custom_provider.status.have_domains_with_token' :
          'signup.step.custom_provider.status.have_domains_without_token'
        );
      } else {
        srvUrlInputState.value = 'success';
        tokenInputState.value = 'error';
        tokenMsg.value = $tr(token ?
          'signup.step.custom_provider.status.no_domains_with_token' :
          'signup.step.custom_provider.status.no_domains_without_token'
        );
      }
    } catch (exc) {
      srvUrlInputState.value = 'error';
      if ((exc as HTTPException).type === 'http-request') {
        srvUrlErrMsg.value = $tr(
          'signup.step.custom_provider.err.non_ok_status',
          { status: `${(exc as HTTPException).status}` }
        );
      } else if ((exc as ConnectException).type === 'http-connect') {
        srvUrlErrMsg.value = $tr('signup.step.custom_provider.err.no_connect');
      } else {
        srvUrlErrMsg.value = $tr('signup.step.custom_provider.err.general');
      }
      console.error(exc);
    }
  } finally {
    clearDomainsCheckingProcess(thisCheckTS);
  }
}

</script>

<template>
  <signup-step
    :current-step=1
    :total-steps=4
    :step-description="$tr('signup.step.custom_provider')"
    :this-step-done=haveDomain
  >

    <div :class="$style.text">
      {{ $tr('signup.step.custom_provider.txt') }}
    </div>

    <ui3n-input
      :class=$style.input
      :label="$tr('field.label.custom_srv_url')"
      :placeholder="$tr('placeholder.custom_srv_url')"
      v-model=customSrvUrl
      :disabled=!!domainsCheckingProcessTS
      @change=getDomainsFromCustomService
      @focus=clearErrMsgs
      :display-state-mode=srvUrlInputState
      display-state-with-icon
      :display-state-message=srvUrlErrMsg
    />

    <ui3n-input
      :class=$style.input
      :label="$tr('field.label.opt_token')"
      v-model=optToken
      :disabled=!!domainsCheckingProcessTS
      @change=getDomainsFromCustomService
      @focus=clearErrMsgs
      :display-state-mode=tokenInputState
      display-state-with-icon
      :display-state-message=tokenMsg
    />

    <div :class=$style.longProcess
      v-if=needDivForLongProcess
    >
      {{ longProcessTxt }}
      <ui3n-progress-linear indeterminate />
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

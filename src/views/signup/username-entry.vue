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
import { inject, onMounted, ref } from 'vue';
import SignupStep from '@/components/signup-step.vue';
import { Ui3nInput, Ui3nMenu, Ui3nIcon, Ui3nInputProps } from '@v1nt1248/3nclient-lib';
import { useSignupStore } from '@/store';
import { I18N_KEY, I18nPlugin } from '@v1nt1248/3nclient-lib/plugins';
import { areAddressesEqual } from '@/lib-common/canonical-address';

defineProps<{
  currentStep: number;
  totalSteps: number;
}>();

const { $tr } = inject<I18nPlugin>(I18N_KEY)!;

const signupState = useSignupStore();

const domainOptions = ref<string[]>([]);
const selectedDomain = ref('');
function selectDomain(domain: string) {
  const ind = signupState.availableDomains.indexOf(domain);
  selectedDomain.value = domain;
  domainOptions.value = ((ind === 0) ?
    signupState.availableDomains.slice(1) :
    [
      ...signupState.availableDomains.slice(0, ind),
      ...signupState.availableDomains.slice(ind+1)
    ]
  );
}

const defaultSignupURL = 'https://signup.privacysafe.me/';

onMounted(async () => {
  if (signupState.availableDomains.length === 0) {
    if (signupState.customSrvUrlWasSet) {
      await w3n.signUp.setSignUpServer(defaultSignupURL);
    }
    signupState.availableDomains = await w3n.signUp.getAvailableDomains();
  }
  selectDomain(signupState.availableDomains[0]);
});

const username = ref('');
const usernameInputMsg = ref('');
const usernameInputState = ref<Ui3nInputProps['displayStateMode']>();
function clearMsgs() {
  usernameInputMsg.value = '';
  usernameInputState.value = undefined;
}

async function checkLoginAvailability() {
  if (!username.value) {
    return;
  }
  const token = (signupState.srvToken ? signupState.srvToken : undefined);
  const availableAddresses = await w3n.signUp.getAvailableAddresses(
    username.value, token
  );
  const address = `${username.value} @${selectedDomain.value}`;
  if (availableAddresses.find(addr => areAddressesEqual(addr, address))) {
    signupState.username = username.value;
    signupState.address = address;
    usernameInputMsg.value = $tr(
      'signup.step.create_user.status.addr_available', { address }
    );
    usernameInputState.value = 'success';
  } else {
    usernameInputMsg.value = $tr(
      'signup.step.create_user.status.addr_not_available', { address }
    );
    usernameInputState.value = 'error';
  }
}

</script>

<template>
  <signup-step
    :current-step=currentStep
    :total-steps=totalSteps
    :step-description="$tr('signup.step.create_user')"
    :this-step-done=!!signupState.address
  >

    <div :class=$style.text>
      {{ $tr('signup.step.create_user.txt') }}
    </div>

    <div :class=$style.domain>
      <span>
        {{ $tr('signup.step.user_domain') }}
      </span>
      <ui3n-menu :class=$style.menu
        v-if="(domainOptions.length > 1)"
      >
        <div :class=$style.selectedDomain>
          {{ selectedDomain }}
          <ui3n-icon
            icon="outline-arrow-drop-down"
            width="24"
            height="24"
          />
        </div>
        <template #menu>
          <div :class=$style.menuOption
            v-for="domain in domainOptions"
            :key="domain"
            @click="selectDomain(domain)"
          >
            {{ domain }}
          </div>
        </template>
      </ui3n-menu>
      <span :class=$style.singleDomain
        v-else
      >
        {{ selectedDomain }}
      </span>
    </div>

    <div :class=$style.input>
      <ui3n-input
        :label="$tr('field.label.username')"
        :placeholder="$tr('placeholder.username')"
        v-model=username
        @focus=clearMsgs
        @change=checkLoginAvailability
        :display-state-mode=usernameInputState
        :display-state-message=usernameInputMsg
        display-state-with-icon
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

.domain {
  position: relative;
  margin-top: var(--spacing-m);
  width: 100%;
  font-size: var(--font-12);
}

.singleDomain {
  margin-left: var(--spacing-l);
  font-size: var(--font-14);
}

.menu {
  display: inline-block;
  margin-left: var(--spacing-m);
}

.selectedDomain {
  height: var(--spacing-l);
  padding-left: var(--spacing-s);
  border-radius: var(--spacing-xs);
  background-color: var(--color-bg-control-secondary-default);
  display: flex;
  align-items: center;
  cursor: pointer;
}
.selectedDomain:hover {
  background-color: var(--color-bg-button-primary-default);
}

.menuOption {
  height: var(--spacing-l);
  padding-left: var(--spacing-s);
  padding-right: var(--spacing-s);
  cursor: pointer;
  align-content: center;
}
.menuOption:hover {
  background-color: var(--color-bg-button-primary-default);
}

.input {
  margin-top: var(--spacing-m);
}
</style>

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
import { router } from '@/router';
import Card from '@/components/card.vue';
import { Ui3nButton, Ui3nInput, Ui3nInputProps, Ui3nMenu, Ui3nIcon } from '@v1nt1248/3nclient-lib';
import { computed, inject, onMounted, ref } from 'vue';
import { useLoggedInUserStore } from '@/store';
import { UserIdParseException, areAddressesEqual, toCanonicalAddress } from '@/lib-common/canonical-address';
import { I18N_KEY, I18nPlugin } from '@v1nt1248/3nclient-lib/plugins';

const { $tr } = inject<I18nPlugin>(I18N_KEY)!;

const defaultDomain = `privacysafe.me`;

const signinTitle = computed(() => {
  if (userOnDisk.value) {
    const indOfAt = userOnDisk.value.indexOf('@');
    const username = userOnDisk.value.substring(0, indOfAt);
    return $tr('signin.welcome', { username });
  } else {
    return $tr('signin.title');
  }
});

const usersOnDisk = ref<string[]>([]);
const menuOptions = computed(
  () => (usersOnDisk.value.length > 0) ?
    usersOnDisk.value
    .filter(addr => (addr !== userOnDisk.value))
    .concat('') :
    []
);

onMounted(async () => {
  try {
    usersOnDisk.value = await w3n.signIn.getUsersOnDisk();
    if (usersOnDisk.value.length > 0) {
      userOnDisk.value = usersOnDisk.value[0];
    }
  } catch (exc) {
    console.error(exc);
  }
});

const userOnDisk = ref('');
const userNotOnDisk = ref('');

const newLogin = ref('');

const loginInputState = ref<Ui3nInputProps['displayStateMode']>();
const loginInputErrMsg = ref<string|undefined>();
function setLoginInputErr(errMsg: string|undefined) {
  if (errMsg) {
    loginInputErrMsg.value = errMsg;
    loginInputState.value = 'error';
  } else {
    loginInputErrMsg.value = '';
    loginInputState.value = undefined;
  }
}
function setLoginInputAsChecked(userId: string) {
  loginInputErrMsg.value = '';
  userNotOnDisk.value = userId;
  loginInputState.value = 'success';
}

const password = ref('');
const passwordInputState = ref<Ui3nInputProps['displayStateMode']>();
const passwordInputErrMsg = ref<string|undefined>();
function setPasswordInputErr(errMsg: string|undefined) {
  if (errMsg) {
    passwordInputErrMsg.value = errMsg;
    passwordInputState.value = 'error';
  } else {
    passwordInputErrMsg.value = '';
    passwordInputState.value = undefined;
  }
}

function setUserOnDisk(userId: string) {
  if (userId) {
    userOnDisk.value = userId;
    userNotOnDisk.value = '';
  } else {
    userOnDisk.value = '';
    userNotOnDisk.value = '';
  }
}

const signInProcessIsON = ref(false);
const signInProgress = ref(0);
function setSignInProgress(p: number) {
  signInProgress.value = p;
}

function switchToPostLogin(userId: string) {
  const loggedUser = useLoggedInUserStore();
  loggedUser.userId = userId;
  router.push('/post-login');
}

async function signin() {
  if (!canStartSignIn.value) {
    return;
  }
  try {
    setSignInProgress(0);
    signInProcessIsON.value = true;
    if (userOnDisk.value) {
      const storageOpened = await w3n.signIn.useExistingStorage(
        userOnDisk.value, password.value, setSignInProgress
      );
      if (storageOpened) {
        switchToPostLogin(userOnDisk.value);
      } else {
        setPasswordInputErr($tr('err.incorrect_password'));
      }
    } else if (userNotOnDisk.value) {
      const storageOpened = await w3n.signIn.completeLoginAndLocalSetup(
        password.value, setSignInProgress
      );
      if (storageOpened) {
        switchToPostLogin(userOnDisk.value);
      } else {
        setPasswordInputErr($tr('err.incorrect_password'));
        startNewLogin();  // reset core's state
      }
    } else {
      throw new Error(`User for signin is not set.`)
    }
  } catch (exc) {
    console.error(exc);
  } finally {
    signInProcessIsON.value = false;
  }
}

const canStartSignIn = computed(() => (
  !signInProcessIsON.value &&
  (userOnDisk.value || userNotOnDisk.value) && !!password.value
));

function addDefaultDomainInNewLoginIfNeeded() {
  const indOfAt = newLogin.value.indexOf('@');
  if (indOfAt < 0) {
    newLogin.value += ` @${defaultDomain}`;
  }
}

async function startNewLogin() {
  if (newLogin.value.length === 0) {
    return;
  }
  addDefaultDomainInNewLoginIfNeeded();
  try {
    toCanonicalAddress(newLogin.value); // implicit check of newLogin
    const knownAddress = usersOnDisk.value.find(
      addr => areAddressesEqual(addr, newLogin.value)
    );
    if (knownAddress) {
      userOnDisk.value = usersOnDisk.value.find(
        addr => areAddressesEqual(addr, newLogin.value)
      )!;
      return;
    }
    const userExists = await w3n.signIn.startLoginToRemoteStorage(
      newLogin.value
    );
    if (userExists) {
      setLoginInputAsChecked(newLogin.value);
    } else {
      const indOfAt = newLogin.value.indexOf('@');
      const login = newLogin.value.substring(0, indOfAt);
      setLoginInputErr($tr('err.login_not_recognized', { login }));
    }
  } catch (err) {
    const indOfAt = newLogin.value.indexOf('@');
    const domain = newLogin.value.substring(indOfAt+1);
    let errMsg = '';
    if ((err as UserIdParseException).type === 'user-id-parse') {
      errMsg = $tr('err.incorrect_login');
    } else if ((err as web3n.RuntimeException).cause) {
      const errCause = (err as web3n.RuntimeException).cause as web3n.ServLocException;
      if (errCause.type === 'service-locating') {
        if (errCause.domainNotFound) {
          errMsg = $tr('err.domain_not_found', { domain });
        } else if (errCause.noServiceRecord) {
          errMsg = $tr('err.domain_has_no_srv', { domain });
        }
      }
    }
    if (errMsg) {
      setLoginInputErr(errMsg);
    } else {
      errMsg = $tr('err.cant_connect_to_srv_on_domain', { domain });
      console.error(errMsg, err);
    }
  }
}

</script>

<template>
  <card
    :title=signinTitle
    :hide-back-btn=true
  >
    <div :class=$style.top>

      <ui3n-input
        v-if=!userOnDisk
        :label="$tr('field.label.login')"
        :placeholder="$tr('placeholder.login')"
        v-model=newLogin
        @change=startNewLogin
        @focus=setLoginInputErr(undefined)
        :display-state-mode=loginInputState
        display-state-with-icon
        :display-state-message=loginInputErrMsg
      />
      <div
        v-else
        :class=$style.menu
      >
        <ui3n-menu>
          <div :class=$style.selectedUserId>
            {{ userOnDisk }}
            <ui3n-icon
              :class="$style.dropDownIcon"
              icon="outline-arrow-drop-down"
              width="24"
              height="24"
            />
          </div>
          <template #menu>
            <div :class=$style.menuOption
              v-for="userId in menuOptions"
              :key=userId
              @click=setUserOnDisk(userId)
            >
              {{ (userId.length > 0) ? userId : $tr('signin.opt.other_login') }}
            </div>
          </template>
        </ui3n-menu>
      </div>

      <ui3n-input :class=$style.inputSpacing
        :label="$tr('field.label.password')"
        :placeholder="$tr('placeholder.enter_password')"
        v-model=password
        type="password"
        @focus=setPasswordInputErr(undefined)
        @change=signin
        :display-state-mode=passwordInputState
        display-state-with-icon
        :display-state-message=passwordInputErrMsg
      />

      <ui3n-button
        type="primary"
        block
        @click=signin
        :disabled=!canStartSignIn
      >
        <span
          v-if="!signInProcessIsON"
        >
          {{ $tr('signin.btn.enter') }}
        </span>
        <span
          v-else
        >
        {{ $tr('signin.btn.entering', { percent: `${signInProgress}` }) }}
        </span>
      </ui3n-button>

    </div>

    <div :class=$style.bottom>
      <div :class=$style.bottomText>
        {{ $tr('signin.make_account.txt') }}
      </div>
      <ui3n-button
        type="custom"
        block
        @click="router.push('/signup/select-provider')"
        color="var(--color-bg-button-tritery-default)"
        text-color="var(--color-text-button-tritery-default)"
        :disabled=signInProcessIsON
      >
        {{ $tr('signin.btn.make_account') }}
      </ui3n-button>
    </div>
  </card>
</template>

<style lang="scss" module>
.top {
  position: absolute;
  top: calc(2*var(--spacing-xxl));
  width: 100%;
}

.inputSpacing {
  margin-top: var(--spacing-m);
  margin-bottom: var(--spacing-ml);
}

.menu div {
  width: 100%;
  max-width: 100%;
  align-content: center;
  cursor: pointer;
  font-size: var(--font-13);
}

.selectedUserId {
  height: var(--spacing-l);
  padding-left: var(--spacing-s);
  border-radius: var(--spacing-xs);
  background-color: var(--color-bg-control-secondary-default);
  display: flex;
  align-items: center;
}
.selectedUserId:hover {
  background-color: var(--color-bg-button-primary-default);
}

.dropDownIcon {
  position: absolute;
  right: var(--spacing-xs);
}

.menuOption {
  height: var(--spacing-l);
  padding-left: var(--spacing-s);
}
.menuOption:hover {
  background-color: var(--color-bg-button-primary-default);
}

.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  align-items: center;
}
.bottomText {
  text-align: center;
  font-size: var(--font-12);
  color: var(--color-text-block-secondary-default);
  margin-bottom: var(--spacing-s);
}
</style>

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
  import { computed, inject, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { NOTIFICATIONS_KEY, type NotificationsPlugin } from '@v1nt1248/3nclient-lib/plugins';
  import { Nullable, Ui3nButton, Ui3nInput, Ui3nRipple as vUi3nRipple } from '@v1nt1248/3nclient-lib';
  import { useLoggedInUserStore } from '@/stores/logged-in-user.store';
  import { APP_ROUTES } from '@/constants';
  import { areAddressesEqual, UserIdParseException } from '@/utils/canonical-address';
  import LoginSelector from '@/components/login-selector.vue';

  const { t } = useI18n();
  const { $createNotice } = inject<NotificationsPlugin>(NOTIFICATIONS_KEY)!;
  const router = useRouter();

  const loggedInUserStore = useLoggedInUserStore();
  const { usersOnDisk } = storeToRefs(loggedInUserStore);
  const { setUserId } = loggedInUserStore;

  const form = ref({
    login: {
      field: '',
      isTouched: false,
      errorMessage: '',
      isMenuOpen: false,
    },
    password: {
      field: '',
      isTouched: false,
      errorMessage: '',
    },
  });
  const doesPasswordShow = ref(false);

  const signInProgress = ref<Nullable<number>>(null);

  const isFormValid = computed(
    () =>
      form.value.login.isTouched &&
      form.value.password.isTouched &&
      !form.value.login.errorMessage &&
      !form.value.password.errorMessage,
  );

  const loginValidationRules = [
    (v: string) => !!v || t('err.field_required'),
    (v: string) => v.includes('@') || t('err.invalid_login'),
  ];
  const passwordValidationRules = [(v: string) => !!v || t('err.field_required')];

  function validate(field: 'login' | 'password', value: string): void {
    form.value[field].errorMessage = '';
    const rules = field === 'login' ? loginValidationRules : passwordValidationRules;
    for (const rule of rules) {
      const res = rule(value);
      if (typeof res === 'string') {
        form.value[field].errorMessage += res;
      }
    }
  }

  function onFieldUpdate(value: string, field: 'login' | 'password') {
    if (!form.value[field].isTouched) {
      form.value[field].isTouched = true;
    }

    validate(field, value);
  }

  function createNewAccount() {
    return router.push({ name: APP_ROUTES.SIGNUP, query: { step: 1 } });
  }

  function switchToPostLoginPage(userId: string) {
    setUserId(userId);
    return router.push({ name: APP_ROUTES.POSTLOGIN });
  }

  async function signIn() {
    if (!isFormValid.value) {
      return;
    }

    try {
      signInProgress.value = 0;
      const userExistOnDisk = usersOnDisk.value.find(u => areAddressesEqual(u, form.value.login.field));
      if (userExistOnDisk) {
        const storageOpened = await w3n.signIn.useExistingStorage(
          form.value.login.field,
          form.value.password.field,
          val => (signInProgress.value = val),
        );
        if (storageOpened) {
          return switchToPostLoginPage(form.value.login.field);
        }

        form.value.password.isTouched = false;
        form.value.password.field = '';
        form.value.password.errorMessage = t('err.incorrect_password');
        return;
      }

      const userExistsRemotely = await w3n.signIn.startLoginToRemoteStorage(form.value.login.field);
      if (!userExistsRemotely) {
        form.value.login.isTouched = false;
        form.value.login.errorMessage = t('err.login_not_recognized', { login: form.value.login.field });
        return;
      }

      const storageOpened = await w3n.signIn.completeLoginAndLocalSetup(
        form.value.password.field,
        val => (signInProgress.value = val),
      );
      if (storageOpened) {
        return switchToPostLoginPage(form.value.login.field);
      }
    } catch (err) {
      console.error(err);
      const indOfAt = form.value.login.field.indexOf('@');
      const domain = form.value.login.field.substring(indOfAt + 1);

      let errMsg = '';
      if ((err as UserIdParseException).type === 'user-id-parse') {
        errMsg = t('err.incorrect_login');
      } else if ((err as web3n.RuntimeException).cause) {
        const errCause = (err as web3n.RuntimeException).cause as web3n.ServLocException;
        if (errCause.type === 'service-locating') {
          if (errCause.domainNotFound) {
            errMsg = t('err.domain_not_found', { domain });
          } else if (errCause.noServiceRecord) {
            errMsg = t('err.domain_has_no_srv', { domain });
          }
        }
      }

      $createNotice({
        type: 'error',
        content: errMsg || t('err.sign_in'),
        duration: 4000,
      });
    } finally {
      signInProgress.value = null;
    }
  }
</script>

<template>
  <section :class="$style.signin">
    <div :class="$style.inputBlock">
      <h3 :class="$style.title">
        {{ t('signin.title') }}
      </h3>

      <div :class="$style.row">
        <login-selector
          v-model="form.login.field"
          :label="t('field.label.login')"
          :placeholder="t('placeholder.login')"
          :items="usersOnDisk"
          :display-state-mode="form.login.isTouched && form.login.errorMessage ? 'error' : undefined"
          :display-state-message="
            !form.login.isMenuOpen && form.login.isTouched && form.login.errorMessage
              ? form.login.errorMessage
              : ''
          "
          @open:menu="form.login.isMenuOpen = $event"
          @update:model-value="ev => onFieldUpdate(ev, 'login')"
        />
      </div>

      <div :class="$style.row">
        <ui3n-input
          v-model="form.password.field"
          :type="doesPasswordShow ? 'text' : 'password'"
          :label="t('field.label.password')"
          :placeholder="t('placeholder.enter_password')"
          :display-state-mode="form.password.isTouched && form.password.errorMessage ? 'error' : undefined"
          :display-state-message="
            form.password.isTouched && form.password.errorMessage ? form.password.errorMessage : ''
          "
          :class="$style.password"
          @update:model-value="ev => onFieldUpdate(ev, 'password')"
        />

        <ui3n-button
          v-if="form.password.field"
          type="icon"
          color="transparent"
          :icon="doesPasswordShow ? 'eye-off-outline' : 'eye-outline'"
          icon-size="20"
          icon-color="var(--color-icon-button-tritery-default)"
          :class="$style.showPasswordBtn"
          @click.stop.prevent="doesPasswordShow = !doesPasswordShow"
        />
      </div>

      <div :class="$style.row">
        <ui3n-button
          block
          :disabled="!isFormValid || signInProgress !== null"
          @click="signIn"
        >
          {{
            signInProgress === null ? t('signin.btn.enter') : t('signin.btn.entering', { percent: signInProgress })
          }}
        </ui3n-button>
      </div>
    </div>

    <div :class="$style.row">
      <span :class="$style.info">
        {{ t('signin.make_account.txt') }}
      </span>

      <div
        v-ui3n-ripple
        :class="$style.createBtn"
        @click="createNewAccount"
      >
        <span>✨</span>
        <span>{{ t('signin.btn.make_account') }}</span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" module>
  @use '@/assets/styles/_mixins' as mixins;

  .signin {
    position: relative;
    width: 100%;
    height: 100%;
    padding: var(--spacing-m) var(--spacing-m) var(--spacing-xxl) var(--spacing-m);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  .inputBlock {
    margin-bottom: var(--spacing-l);
  }

  .title {
    font-size: var(--font-20);
    font-weight: 500;
    line-height: 1;
    color: var(--color-text-block-primary-default);
    text-align: center;
    margin-block-start: 0;
    margin-block-end: 48px;
  }

  .row {
    position: relative;
    width: 100%;
    margin-bottom: var(--spacing-s);

    .showPasswordBtn {
      position: absolute;
      max-width: 28px !important;
      width: 28px !important;
      min-width: 28px !important;
      max-height: 28px;
      top: 22px;
      right: 2px;
      z-index: 1;
    }
  }

  .password {
    input {
      padding-right: var(--spacing-l);
    }
  }

  .label {
    display: block;
    position: relative;
    font-size: var(--font-12);
    font-weight: 600;
    line-height: var(--font-16);
    color: var(--color-text-control-primary-default);
    margin-bottom: var(--spacing-xs);
  }

  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: max-content;
  }

  .itemName {
    font-size: var(--font-14);
    line-height: var(--font-16);
    font-weight: 500;
    color: var(--color-text-control-primary-default);
    @include mixins.text-overflow-ellipsis();
  }

  .info {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: var(--font-13);
    font-weight: 400;
    line-height: var(--font-16);
    color: var(--color-text-block-secondary-default);
    margin-bottom: var(--spacing-s);
  }

  .createBtn {
    --start-bg-color: oklch(from var(--default-fill-default) calc(100% - l) c h);

    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: var(--spacing-xs);
    border-radius: 12px;
    color: var(--color-text-button-primary-default);
    text-shadow: 0 1px 3px var(--shadow-far);
    font-size: var(--font-15);
    font-weight: 600;
    line-height: 1;
    cursor: pointer;

    border: 1.5px solid color-mix(in oklch, var(--default-fill-default), transparent 80%);
    background: linear-gradient(
      130deg,
      var(--color-text-button-primary-default) 0%,
      var(--color-bg-button-primary-default) 35% 65%,
      var(--color-text-button-primary-default) 100%
    );
    box-shadow:
      0 0 12px color-mix(in oklch, var(--color-bg-button-primary-default) 80%, transparent),
      0 0 24px color-mix(in oklch, var(--color-bg-button-primary-default) 40%, transparent),
      inset 0 1px 1px var(--shadow-far);

    transition: 0.3s ease;

    &:hover {
      filter: brightness(1.1);
      transition: 0.3s ease;
    }
  }
</style>

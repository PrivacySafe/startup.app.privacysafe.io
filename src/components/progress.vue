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
  import { inject, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { NOTIFICATIONS_KEY } from '@v1nt1248/3nclient-lib/plugins';
  import { Ui3nIcon } from '@v1nt1248/3nclient-lib';
  import { useSignupStore } from '@/stores/signup.store';
  import { useLoggedInUserStore } from '@/stores/logged-in-user.store';
  import { APP_ROUTES } from '@/constants';

  const { t } = useI18n();
  const router = useRouter();
  const { $createNotice } = inject(NOTIFICATIONS_KEY)!;

  const signupStore = useSignupStore();
  const { keyGenerationProc, address, srvToken, password } = storeToRefs(signupStore);
  const { setStoreFieldValue } = signupStore;

  const { setUserId } = useLoggedInUserStore();

  const isProcessing = ref(false);

  async function createAccountOnServer() {
    try {
      const token = srvToken.value || undefined;
      const added = await w3n.signUp.addUser(address.value, token);
      if (added) {
        setUserId(address.value);
        return router.push({ name: APP_ROUTES.POSTLOGIN });
      }

      $createNotice({
        type: 'warning',
        content: t('err.singup_available_err', { address: address.value }),
        duration: 4000,
      });

      setTimeout(() => {
        return router.push({ name: APP_ROUTES.SIGNUP, query: { step: 2 } });
      }, 4000);
    } catch (err) {
      $createNotice({
        type: 'error',
        content: t('err.singup_general_err'),
        duration: 0,
      });
      console.error(err);
    }
  }

  onMounted(async () => {
    isProcessing.value = true;
    setStoreFieldValue('keyGenerationProc', 0);

    w3n.signUp
      .createUserParams(password.value, p => {
        setStoreFieldValue('keyGenerationProc', p);
      })
      .then(() => createAccountOnServer())
      .catch(err => {
        console.error(err);
        setStoreFieldValue('keyGenerationProc', undefined);
        isProcessing.value = false;
        $createNotice({
          type: 'error',
          content: t('err.singup_general_err'),
          duration: 0,
        });
      });
  });
</script>

<template>
  <div :class="$style.progressPage">
    <h3 :class="$style.title">
      {{ t('signup.step.progress.title') }}
    </h3>

    <div :class="$style.text">
      {{ t('signup.step.progress.txt') }}
    </div>

    <div :class="$style.row">
      <ui3n-icon
        v-if="isProcessing"
        icon="spinner"
        size="64"
        color="var(--color-border-control-accent-default)"
      />
    </div>

    <div :class="$style.row">
      <span
        v-if="keyGenerationProc !== undefined"
        :class="$style.progress"
      >
        {{ t('signup.step.progress.txt1', { value: keyGenerationProc }) }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" module>
  .progressPage {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: var(--font-20);
      font-weight: 500;
      line-height: 1;
      color: var(--color-text-block-primary-default);
      text-align: center;
      margin-block-start: 0;
      margin-block-end: var(--spacing-ml);
    }

    .text {
      font-size: var(--font-12);
      font-weight: 400;
      line-height: var(--font-18);
      color: var(--color-text-block-primary-default);
    }

    .row {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .progress {
      font-size: var(--font-16);
      font-weight: 600;
      line-height: var(--font-32);
      color: var(--color-text-control-accent-default);
    }
  }
</style>

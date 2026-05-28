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
  import { Ui3nProgressLinear } from '@v1nt1248/3nclient-lib';
  import { useSignupStore } from '@/stores/signup.store';
  import { useLoggedInUserStore } from '@/stores/logged-in-user.store';
  import { APP_ROUTES } from '@/constants';
  import prLogo from '@/assets/images/privacysafe-logo.svg';
  import StartupFooter from '@/components/startup-footer.vue';

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

      console.warn(`skipping creation of account in debug process`);
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
    .then(async () => {
      setStoreFieldValue('keyGenerationProc', undefined);
      await createAccountOnServer();
    })
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
  <section>
    <div :class="$style.progressPage">

      <div :class="$style.logoBlock">
        <img
          :src="prLogo"
          alt="PrivacySafe logo"
        />
      </div>

      <div :class="$style.progress"
        v-if="keyGenerationProc !== undefined"
      >
        {{ `${keyGenerationProc} %` }}
        <br>
        <ui3n-progress-linear
          height="16"
          :value="keyGenerationProc"
          :color="'var(--signin-green)'"
        />
      </div>

      <div :class="$style.progress"
        v-else
      >
        {{ ' ' }}
        <br>
        <ui3n-progress-linear indeterminate
          height="16"
          :color="'var(--signin-green)'"
        />
      </div>

      <div :class="$style.text">
        {{ t((keyGenerationProc !== undefined) ? 'signup.step.progress.key_generation_txt' : 'signup.step.progress.txt') }}
        <br>
        {{ address }}
      </div>

    </div>

    <startup-footer>
      <div :class="$style.footer">
        <span> </span>
      </div>
    </startup-footer>
  </section>
</template>

<style lang="scss" module>
  .progressPage {
    position: relative;
    width: 100%;
    min-height: calc(var(--spacing-xxl)*10);
    padding-left: var(--spacing-s);
    padding-right: var(--spacing-s);

    .logoBlock {
      width: 100%;
      img {
        width: calc(100% - var(--spacing-s));
      }
      margin-top: calc(var(--spacing-xl) * 2 - var(--spacing-m));
    }

    font-size: var(--font-16);
    font-weight: 600;
    line-height: var(--font-32);

    .text {
      width: 100%;
      margin-top: var(--spacing-ml);
      text-align: center;
    }

    .progress {
      width: 100%;
      margin-top: var(--spacing-m);
      text-align: center;
      color: var(--signin-green);
    }

  }
</style>

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
import { onMounted, ref, watch } from 'vue';
import { useLoggedInUserStore, useSignupStore } from '@/store';

const signupState = useSignupStore();
const loggedIn = useLoggedInUserStore();

const statusMsg = ref('');

onMounted(() => watch(signupState,
  () => {
    if (signupState.keyGenerationProc === undefined) {
      console.error(`Key generation process wasn't started, or has failed`);
      router.push('/signup/step/1');
    } else if (signupState.keyGenerationProc === true) {
      statusMsg.value = 'Keys generated.';
      createAccountOnServer();
    } else {
      statusMsg.value = `Key generation: ${signupState.keyGenerationProc}%`;
    }
  },
  { immediate: true }
));

async function createAccountOnServer() {
  try {
    const token = (signupState.srvToken ? signupState.srvToken : undefined);
    const added = await w3n.signUp.addUser(signupState.address, token);
    if (added) {
      loggedIn.userId = signupState.address;
      router.push('/post-login');
    } else {
      statusMsg.value = `Account wasn't created. Address ${signupState.address} is no longer available.`;
    }
  } catch (err) {
    statusMsg.value = `Error occurred. `;
    console.error(err);
  }
}

</script>

<template>
  <card
    title="Private Keys"
    :hide-back-btn=true
  >
    <div :class=$style.middle>
      {{ $tr('signup.step.progress.txt') }}
    </div>

    <div :class=$style.bottom>
      <!-- Add round progress and a line with percent output -->
      {{ statusMsg }}
    </div>
  </card>
</template>

<style lang="scss" module>
.middle {
  position: absolute;
  top: calc(2*var(--spacing-xxl));
  width: 100%;
  text-align: justify;
  font-size: var(--font-12);
}

.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.bottom div {
  width: 100%;
  text-align: center;
  color: var(--color-text-block-secondary-default);
  font-size: var(--font-12);
  margin-top: var(--spacing-s);
  margin-bottom: var(--spacing-s);
}
</style>

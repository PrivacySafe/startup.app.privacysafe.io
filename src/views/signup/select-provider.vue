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
import { Ui3nButton } from '@v1nt1248/3nclient-lib';
import { useSignupStore } from '@/store';

const signupState = useSignupStore();

signupState.clear();

</script>

<template>
  <card
    :title="$tr('signup.choice.title')"
  >
    <div :class=$style.middle>
      {{ $tr('signup.choice.txt') }}
    </div>

    <div :class=$style.bottom>
      <ui3n-button
        type="secondary"
        block
        @click="router.push('/signup/custom-provider/1')"
      >
        {{ $tr('signup.choice.btn.custom_provider') }}
      </ui3n-button>
      <div>
        {{ $tr('signup.choice.txt_or') }}
      </div>
      <ui3n-button
        block
        @click="router.push('/signup/privacysafe-provider/1')"
      >
        {{ $tr('signup.choice.btn.privacysafe_provider') }}
      </ui3n-button>
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

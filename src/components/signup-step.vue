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
import Card from './card.vue';
import { Ui3nButton, Ui3nStepLineBar } from '@v1nt1248/3nclient-lib';
import { inject } from 'vue';
import { I18N_KEY, I18nPlugin } from '@v1nt1248/3nclient-lib/plugins';

const props = defineProps<{
  stepDescription: string;
  thisStepDone: boolean;
  currentStep: number;
  totalSteps: number;
  nextBtnTxt?: string;
}>();

const emits = defineEmits<{
  (ev: 'next'): void;
}>();

const { $tr } = inject<I18nPlugin>(I18N_KEY)!;

const lineBarLabel = `${$tr('signup.step_count', { num: `${props.currentStep}`, total: `${props.totalSteps}` })}: ${props.stepDescription}`;

function next() {
  emits('next');
  setTimeout(() => {
    if (props.currentStep < props.totalSteps) {
      let path = location.pathname;
      path = `${path.substring(0, path.length-1)}${props.currentStep+1}`;
      router.push({ path });
    } else {
      router.push('/signup/progress');
    }
  }, 10);
}
</script>

<template>
  <card
    :title="$tr('signup.title')"
  >
    <div :class=$style.main>
      <ui3n-step-line-bar
        :label=lineBarLabel
        :current=currentStep
        :steps=totalSteps
      />
      <div :class=$style.slot>
        <slot></slot>
      </div>
    </div>

    <div :class=$style.bottom>
      <ui3n-button
        block
        :disabled=!thisStepDone
        @click=next
      >
        {{ nextBtnTxt || $tr('signup.step.btn.next') }}
      </ui3n-button>
    </div>
  </card>
</template>

<style lang="scss" module>
.main {
  width: 100%;
}

.slot {
  margin-top: var(--spacing-m);
  position: relative;
  width: 100%;
}

.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>

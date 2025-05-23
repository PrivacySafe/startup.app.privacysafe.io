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
import { computed, ref } from 'vue';
import SignupStep from '@/components/signup-step.vue';
import { Ui3nCheckbox, Ui3nTooltip } from '@v1nt1248/3nclient-lib';

defineProps<{
  currentStep: number;
  totalSteps: number;
}>();

const checks = ref([false, false, false]);
const allChecked = computed(() => checks.value.reduce((a, b) => (a && b)));

const checkboxText = [
  [
    'signup.step.acknowledgments.txt.check1.p1',
    {
      txt: 'signup.step.acknowledgments.txt.check1.p2',
      tip: 'signup.step.acknowledgments.txt.check1.p2.tip'
    },
    'signup.step.acknowledgments.txt.check1.p3'
  ],
  [
    'signup.step.acknowledgments.txt.check2.p1',
    {
      txt: 'signup.step.acknowledgments.txt.check2.p2',
      tip: 'signup.step.acknowledgments.txt.check2.p2.tip'
    },
    'signup.step.acknowledgments.txt.check2.p3'
  ],
  [
    'signup.step.acknowledgments.txt.check3.p1',
    {
      txt: 'signup.step.acknowledgments.txt.check3.p2',
      tip: 'signup.step.acknowledgments.txt.check3.p2.tip'
    },
    'signup.step.acknowledgments.txt.check3.p3'
  ]
];

</script>

<template>
  <signup-step
    :current-step=currentStep
    :total-steps=totalSteps
    :step-description="$tr('signup.step.acknowledgments')"
    :this-step-done=allChecked
    :next-btn-txt="$tr('signup.step.acknowledgments.btn')"
  >

    <div :class=$style.text>
      {{ $tr('signup.step.acknowledgments.txt.intro') }}
    </div>

    <ui3n-checkbox
      :class=$style.option
      v-for="ind in [0, 1, 2]"
      v-model=checks[ind]
    >
      <template v-for="txtSegment in checkboxText[ind]">
        <span v-if="typeof txtSegment === 'string'">
          {{ $tr(txtSegment) }}
        </span>
        <ui3n-tooltip v-else
          :content="$tr(txtSegment.tip)"
          :placement="(ind === 2) ? 'top-start' : 'top-end'"
          trigger="hover"
          :class=$style.tooltip
        >
          {{ $tr(txtSegment.txt) }}
        </ui3n-tooltip>
      </template>
    </ui3n-checkbox>

  </signup-step>
</template>

<style lang="scss" module>
.text {
  margin-top: var(--spacing-xxl);
  margin-bottom: var(--spacing-l);
  font-size: var(--font-12);
}

.option {
  margin-bottom: var(--spacing-m);
}

.tooltip {
  display: inline-block;
  text-decoration: underline;
}
.tooltip div {
  max-width: 20em;
}
</style>

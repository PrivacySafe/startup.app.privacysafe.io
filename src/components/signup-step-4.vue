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
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Ui3nButton, Ui3nCheckbox } from '@v1nt1248/3nclient-lib';

  const emits = defineEmits<{
    (event: 'change:step', payload: { step: number; query?: Record<string, string> }): void;
  }>();

  const { t } = useI18n();

  const form = ref({
    v1: false,
    v2: false,
    v3: false,
    v4: false,
  });

  const isFormValid = computed(() => form.value.v1 && form.value.v2 && form.value.v3 && form.value.v4);
</script>

<template>
  <div :class="$style.step4">
    <div :class="$style.body">
      <div :class="$style.text">
        {{ t('signup.step.acknowledgments.txt.intro') }}
      </div>

      <div :class="$style.row">
        <div :class="$style.item">
          <ui3n-checkbox v-model="form.v1" />
          <span :class="$style.itemText">{{ t('signup.step.acknowledgments.txt.check1.p1') }}</span>
        </div>

        <div :class="$style.item">
          <ui3n-checkbox v-model="form.v2" />
          <span :class="$style.itemText">
            {{ t('signup.step.acknowledgments.txt.check2.p1') }}
            <span :class="$style.highlight">{{ t('signup.step.acknowledgments.txt.check2.p2') }}</span>
          </span>
        </div>

        <div :class="$style.item">
          <ui3n-checkbox v-model="form.v3" />
          <span :class="$style.itemText">{{ t('signup.step.acknowledgments.txt.check3.p1') }}</span>
        </div>

        <div :class="$style.item">
          <ui3n-checkbox v-model="form.v4" />
          <span :class="$style.itemText">{{ t('signup.step.acknowledgments.txt.check4.p1') }}</span>
        </div>
      </div>
    </div>

    <ui3n-button
      block
      :disabled="!isFormValid"
      :class="$style.createBtn"
      @click="emits('change:step', { step: 5 })"
    >
      {{ t('signup.step.acknowledgments.btn') }}
    </ui3n-button>
  </div>
</template>

<style lang="scss" module>
  .step4 {
    position: relative;
    width: 100%;
    height: 100%;

    .body {
      position: relative;
      width: 100%;
      max-height: calc(100% - 56px);
      height: 260px;
      margin-bottom: var(--spacing-m);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      row-gap: var(--spacing-m);

      .text {
        display: inline-block;
        font-size: var(--font-13);
        font-weight: 400;
        line-height: 1.5;
      }

      .row {
        position: relative;
        width: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        row-gap: 12px;
        overflow-y: auto;

        .item {
          display: flex;
          width: 100%;
          justify-content: flex-start;
          align-items: center;
          column-gap: var(--spacing-s);
          font-size: var(--font-12);
          font-weight: 500;
          line-height: var(--font-16);
          color: var(--color-text-control-primary-default);

          .itemText {
            display: inline-block;
            position: relative;
            width: calc(100% - var(--spacing-ml));
            white-space: break-spaces;
          }

          .highlight {
            color: var(--color-text-block-accent-default);
          }
        }
      }
    }

    .createBtn {
      min-height: var(--spacing-xl);
      height: var(--spacing-xl);
      border-radius: var(--spacing-s);

      span {
        font-size: var(--font-14);
      }
    }
  }
</style>

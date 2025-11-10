<!--
 Copyright (C) 2024 - 2025 3NSoft Inc.

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
import { Ui3nButton } from '@v1nt1248/3nclient-lib';

const props = defineProps<{
  title: string;
  hideBackBtn?: boolean;
  backPath?: string;
}>();

function goBack() {
  if (props.backPath) {
    router.push(props.backPath);
  } else {
    router.back();
  }
}

</script>

<template>
  <div :class=$style.card>

    <div :class=$style.top_row>
      <ui3n-button
        type="icon"
        icon="round-arrow-back"
        color="var(--color-bg-block-primary-default)"
        icon-color="var(--color-icon-button-secondary-default)"
        icon-size="24"
        :class=$style.back_btn
        v-if=!hideBackBtn
        @click=goBack
      />
      <div :class=$style.title>
        {{ title }}
      </div>
    </div>

    <div :class=$style.slot>
      <slot></slot>
    </div>

  </div>
</template>

<style lang="scss" module>
.card {
  background-color: var(--color-bg-block-primary-default);
  color: var(--color-text-block-primary-default);
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.top_row {
  margin-top: var(--spacing-m);
  position: relative;
  height: var(--spacing-l);
}

.back_btn {
  position: absolute;
  top: 0;
  left: var(--spacing-m);
}

.title {
  width: 100%;
  height: var(--spacing-l);
  align-content: center;
  text-align: center;
  font-size: var(--font-20);
}

.slot {
  position: relative;
  width: calc(100% - 2*var(--spacing-m));
  margin-left: var(--spacing-m);
  height: calc(100% - (3*var(--spacing-m) + var(--spacing-l)));
  margin-top: var(--spacing-m);
}
</style>

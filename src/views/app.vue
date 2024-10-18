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
import { RouterView } from 'vue-router';

</script>

<template>
    <div :class=$style.card>
      <router-view></router-view>
    </div>
</template>

<style lang="scss" module>

.card {
  // background-color: var(--color-bg-block-primary-default);
  // color: var(--color-text-block-primary-default);
  margin: 0;
  width: 380px;
  height: 496px;
  position: fixed;
  top: calc(50% - 248px);
  left: calc(50% - 190px);
  border-radius: var(--spacing-m);
  overflow: hidden;
}

// conditional section has to be below unconditional one to override values
@media screen and (max-width: 420px) and (max-height: 530px) {

  .card {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 0;
  }

}

</style>

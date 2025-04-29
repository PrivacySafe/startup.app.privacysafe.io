/**
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
*/

import { toRO } from "@/utils/readonly";
import { Ui3nInputProps } from "@v1nt1248/3nclient-lib";
import { ref } from "vue";

export function useInputState() {

  const stateMsg = ref('');
  const stateMode = ref<Ui3nInputProps['displayStateMode']>();

  function setState(msg: string, mode: Ui3nInputProps['displayStateMode']) {
    stateMsg.value = msg;
    stateMode.value = mode;
  }

  function clearState() {
    setState('', undefined);
  }

  function setStateForSecs(
    msg: string, mode: Ui3nInputProps['displayStateMode'], periodSecs: number
  ) {
    setState(msg, mode);
    setTimeout(() => {
      if (stateMsg.value === msg) {
        clearState();
      }
    }, periodSecs*1000);
  }

  return {
    stateMode: toRO(stateMode),
    stateMsg: toRO(stateMsg),
    clearState,
    setState,
    setStateForSecs
  };
}
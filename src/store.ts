/*
 Copyright (C) 2024 - 2025 3NSoft Inc.

 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { defineStore } from 'pinia';
import { ref } from 'vue';

type BootEvent = web3n.startup.BootEvent;

export interface SignupState {
  username: string;
  userDomain: string;
  address: string;
  password: string;
  customSrvUrlWasSet: boolean;
  customSrvUrl: string;
  srvToken: string;
  availableDomains: string[];
  keyGenerationProc: undefined | number | true;
}

export const useSignupStore = defineStore('signup', {

  state: (): SignupState => ({
    username: '',
    userDomain: '',
    address: '',
    password: '',
    customSrvUrlWasSet: false,
    customSrvUrl: '',
    srvToken: '',
    availableDomains: [],
    keyGenerationProc: undefined
  }),

  getters: {
  },

  actions: {

    clear(): void {
      this.username = '';
      this.userDomain = '';
      this.address = '';
      this.password = '';
      this.customSrvUrlWasSet = false;
      this.customSrvUrl = '';
      this.srvToken = '';
      this.availableDomains = [];
      this.keyGenerationProc = undefined;
    }

  }

});

export interface LoggedInUser {
  userId: string;
}

export const useLoggedInUserStore = defineStore('loggedInUser', {

  state: (): LoggedInUser => ({
    userId: ''
  }),

});

export const useBootEvents = defineStore('bootEvents', () => {

  const eventsLog = ref<BootEvent[]>([]);
  const bootDone = ref(false);

  w3n.signIn.watchBoot({
    next: ev => {
      eventsLog.value.push(ev);
    },
    complete: () => {
      bootDone.value = true;
    }
  });

  return {
    eventsLog,
    bootDone
  };
});

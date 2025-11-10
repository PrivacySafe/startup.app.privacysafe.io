/*
 Copyright (C) 2024 - 2025 3NSoft Inc.

 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { defaultSignupURL, signupParamsToLink, SignupParamsViaURL } from './utils/signup-links';

type BootEvent = web3n.startup.BootEvent;
type HTTPException = web3n.HTTPException;
type ConnectException = web3n.ConnectException;

export const useSignupStore = defineStore('signup', () => {

  const username = ref('');
  const userDomain = ref('');
  const address = ref('');
  const password = ref('');
  const isStandardService = ref(true);
  const srvToken = ref('');
  const availableDomains = ref<string[]>([]);
  const keyGenerationProc = ref<undefined|number|true>(undefined);
  const signupLink = ref('');

  async function getDomainsFor(params: SignupParamsViaURL): Promise<{
    domains?: string[];
    errMsgLabel?: string;
    okMsgLabel?: string;
    labelParams?: Record<string, string>
  }> {
    const { signupUrl, token, isStandardService } = params;
    if (isStandardService) {
      await w3n.signUp.setSignUpServer(defaultSignupURL);
    } else {
      await w3n.signUp.setSignUpServer(signupUrl);
    }
    try {
      const domains = await w3n.signUp.getAvailableDomains(token);
      if (domains.length > 0) {
        return {
          domains,
          okMsgLabel: (token ?
            'signup.choice.status.have_domains_with_token' :
            'signup.choice.status.have_domains_without_token'
          )
        };
      } else {
        return {
          errMsgLabel: (token ?
            'signup.choice.status.no_domains_with_token' :
            'signup.choice.status.no_domains_without_token'
          )
        };
      }
    } catch (exc) {
      if ((exc as HTTPException).type === 'http-request') {
        return {
          errMsgLabel: 'signup.choice.err.non_ok_status',
          labelParams: { status: `${(exc as HTTPException).status}` }
        };
      } else if ((exc as ConnectException).type === 'http-connect') {
        return {
          errMsgLabel: 'signup.choice.err.no_connect',
        };
      } else {
        return {
          errMsgLabel: 'signup.choice.err.general',
        };
      }
    }
  }

  async function checkSignupParamsAndSetDomains(params: SignupParamsViaURL): Promise<boolean> {
    const { domains } = await getDomainsFor(params);
    if (domains) {
      const { isStandardService: isStdSrv, token } = params;
      srvToken.value = token ?? '';
      isStandardService.value = !!isStdSrv;
      availableDomains.value = domains;
      signupLink.value = signupParamsToLink(params);
      return true;
    } else {
      return false;
    }
  }

  async function initStandard(): Promise<void> {
    isStandardService.value = true;
    signupLink.value = '';
    srvToken.value = '';
    const { domains } = await getDomainsFor({ signupUrl: '', isStandardService: true, token: undefined });
    console.log(`@store.initStandard(), domains are`, domains);
    availableDomains.value = domains ?? [];
  }

  return {
    username,
    userDomain,
    address,
    password,
    isStandardService,
    srvToken,
    availableDomains,
    keyGenerationProc,
    signupLink,

    initStandard,
    checkSignupParamsAndSetDomains,
    getDomainsFor
  };
});

export const useLoggedInUserStore = defineStore('loggedInUser', () => {

  const userId = ref('');

  return {
    userId
  };
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

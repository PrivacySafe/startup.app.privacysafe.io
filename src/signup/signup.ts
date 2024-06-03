/*
 Copyright (C) 2017, 2023 3NSoft Inc.

 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
import { IAngularStatic, IComponentOptions, IQService, IScope, ITimeoutService } from 'angular';
import { StateService } from '@uirouter/angularjs';
import * as LoginSrvMod from './../services/login-srv';

export const ModuleName = '3nweb.components.signup'
;
const NOTIF_DURATION = 5000;
const KEYS = {
  ENTER: 13,
  ESC: 27,
};

interface SignUpScope extends IScope {
  signup: any;
}

type SignUpStep = 'provider-choice' |
  'ps-1' | 'ps-2' | 'ps-3' |
  'custom-1' | 'custom-2' | 'custom-3' | 'custom-4';

class Controller {
  CONST = {
    NAME_MIN_LENGTH: 6,
    NAME_MAX_LENGTH: 30,
    PASSWORD_MIN_LENGTH: 12,
  };
  user: web3n.start.User = {
    login: '',
    password: '',
  };
  step: SignUpStep = 'provider-choice';
  signupError = '';
  isWait = false;
  waitText = '';
  questions = {
    q1: false,
    q2: false,
    q3: false,
  };
  isCreateDisabled = true;


  static $inject = ['$scope', '$state', '$timeout', LoginSrvMod.LoginSrvName];
  constructor(
    private $scope: SignUpScope,
    private $state: StateService,
    private $timeout: ITimeoutService,
    private _loginSrv: LoginSrvMod.LoginSrv
  ) { 
  }

  private focusOnTextInput(nameSelector: string): void {
    this.$timeout(() => {
      const txtInput = document.querySelector(
        `input[name="${nameSelector}"]`
      ) as HTMLInputElement;
      txtInput.focus();
    }, 20);
  }

  goToSignin(): void {
    this.$state.go('signin');
  }

  startPrivacySafeSignup(): void {
    this.user.domain = 'privacysafe.me';
    this.user.customServiceUrl = undefined;
    this.user.availableDomains = undefined;
    this.changeStepTo('ps-1', 'loginname');
  }

  startCustomSignup(): void {
    this.user.domain = undefined;
    this.user.customServiceUrl = undefined;
    this.user.availableDomains = undefined;
    this.changeStepTo('custom-1', 'customServiceUrl');
  }

  private setWaitOnAction(waitText?: string): void {
    this.$timeout(() => {
      this.isWait = true;
      this.waitText = waitText;
      this.signupError = '';
    });
  }

  private endWait(signupError = ''): void {
    this.isWait = false;
    this.waitText = '';
    this.signupError = signupError;
  }

  private clearStateOnStepChange(): void {
    this.endWait();
  }

  private changeStepTo(step: SignUpStep, txtFieldToFocus?: string): void {
    this.clearStateOnStepChange();
    this.step = step;
    if (txtFieldToFocus) {
      this.focusOnTextInput(txtFieldToFocus);
    }
  }

  keyEventHandler(event: KeyboardEvent, field: string): void {
    const keyCode = event.keyCode || event.which;
    switch (keyCode) {
      case KEYS.ESC:
        this.$timeout(() => {
          this.user[field] = '';
        });
        break;
      case KEYS.ENTER:
        switch (field) {
          case 'name':
            if (!!this.user.name) {
              if (this.step === 'ps-1') {
                if (
                  this.user.name.length >= this.CONST.NAME_MIN_LENGTH &&
                  this.user.name.length <= this.CONST.NAME_MAX_LENGTH &&
                  !this.user.name.includes('@')
                ) {
                    this.doOnStepPS1();
                }
              } else if (this.step === 'custom-2') {
                if (
                  this.user.name.length > 0 &&
                  !this.user.name.includes('@')
                ) {
                  this.doOnStepCustom2();
                }
              }
            }
            break;
          case 'password':
            if (!!this.user.password) {
              if (this.user.password.length >= this.CONST.PASSWORD_MIN_LENGTH) {
                this.focusOnTextInput('confirmpassword');
              }
            }
            break;
          case 'passwordConfirm':
            if (!!this.user.passwordConfirm) {
              if (!this.$scope.signup.$invalid && !this.signupError) {
                if (this.step === 'ps-2') {
                  this.doOnStepPS2();
                } 
              } else if (this.step === 'custom-3') {
                this.doOnStepCustom3();
              }
            }
            break;
        }
        break;
    }
  }

  private doOnUsernameCheckingStep(nextStep: SignUpStep): void {
    this.setWaitOnAction(`Checking available addresses ...`);
    this.user.login = `${this.user.name}@${this.user.domain}`;
    this._loginSrv.getAvailableAddresses(
      this.user.name,
      (this.user.signupToken ? this.user.signupToken : undefined)
    )
    .then(possibleLogins => {
      if (possibleLogins.includes(this.user.login)) {
        this.changeStepTo(nextStep, 'password');
      } else {
        this.endWait(`Try another username. Account ${this.user.login} is not available.`);
      }
    })
    .catch(err => {  
      console.error(err);
      this.endWait(`Unknown error. Try later.`);
    });
  }

  doOnStepPS1(): void {
    this.doOnUsernameCheckingStep('ps-2');
  }

  private doOnKeyGenerationStep(nextStep: SignUpStep): void {
    this.setWaitOnAction(`Secret key generation`);
    this._loginSrv.getLoginKey(this.user.password, (progress: number) => {
      this.$timeout(() => {
        this.setWaitOnAction(`Secret key generation is completed by ${progress}%`);
      });
    })
    .then(() => {
      this.changeStepTo(nextStep);
    })
    .catch(err => {
      console.error(err);
      this.endWait(`Error when generating a secret key. Try again.`);
    });
  }

  doOnStepPS2(): void {
    this.doOnKeyGenerationStep('ps-3');
  }

  checkPassword(event: KeyboardEvent): void {
    if (!!this.user.passwordConfirm) {
      if (this.user.passwordConfirm !== this.user.password) {
        this.signupError = 'Error. Password is not correct.';
      } else {
        this.signupError = '';
        this.keyEventHandler(event, 'passwordConfirm');
      }
    } else {
      this.signupError = '';
    }
  }

  checkAnswers() {
    let isAllTrue = true;
    for (let key of Object.keys(this.questions)) {
      if (!this.questions[key]) {
        isAllTrue = false;
        break;
      }
    }
    this.$timeout(() => {
      this.isCreateDisabled = !isAllTrue;
    });
  }

  createAccount(): void {
    this.setWaitOnAction('Account creation in progress ...');
    this._loginSrv.createNewAccount(
      this.user.login,
      (this.user.signupToken ? this.user.signupToken : undefined)
    )
    .then(created => {
      if (!created) {
        this.endWait(`Unfortunately, there was an error creating the user ${this.user.login}. Restart Sign Up.`);
      }
    })
    .catch(err => {
      console.error(err);
      this.endWait(`Unknown error. Try again.`);
    });
  }

  doOnStepCustom1(): void {
    this.setWaitOnAction('Connecting to service ...');
    this._loginSrv.setSignUpServer(this.user.customServiceUrl)
    .then(() => this._loginSrv.getAvailableDomains(this.user.signupToken))
    .then(domains => {
      if (domains.length === 0) {
        this.endWait(`No domains available. Try another token?`);
      } else if (domains.length === 1) {
        this.user.domain = domains[0];
        this.changeStepTo('custom-2');
      } else {
        this.user.availableDomains = domains;
        this.changeStepTo('custom-2');
      }
    })
    .catch(err => {
      if (err.type === 'http-request') {
        this.endWait(`Service's response is not ok. Verify its url.`);
      } else if (err.type === 'http-connect') {
        this.endWait(`Can't connect to service. Verify service url.`);
      } else {
        console.error(err);
        this.endWait(`Unknown error. Try again.`);
      }
    });
  }

  doOnStepCustom2(): void {
    this.doOnUsernameCheckingStep('custom-3');
  }

  doOnStepCustom3(): void {
    this.doOnKeyGenerationStep('custom-4');
  }

}

const componentConfig: IComponentOptions = {
  bindings: {},
  templateUrl: './signup/signup.html',
  controller: Controller,
};

export function addComponent(ng: IAngularStatic): void {
  const mod = ng.module(ModuleName, []);
  mod.component("signUp", componentConfig);
}
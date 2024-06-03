/*
 Copyright (C) 2016 3NSoft Inc.

 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>. */

import {
  IAngularStatic,
  IQService,
  ITimeoutService,
  IPromise,
} from 'angular';

export let ModuleName = '3nweb.services.login-srv';

export let LoginSrvName = 'loginService';

export function addService(ng: IAngularStatic): void {
  let mod = ng.module(ModuleName, []);
  mod.service(LoginSrvName, LoginSrv);
}

export class LoginSrv {
  private _signInSrv: web3n.startup.SignInService;
  private _signUpSrv: web3n.startup.SignUpService;

  static $inject = ['$q', '$timeout'];
  constructor(
    private $q: IQService,
    private $timeout: ITimeoutService
  ) {
    this._signInSrv = w3n.signIn;
    this._signUpSrv = w3n.signUp;
  }

  setSignUpServer(signupUrl: string): IPromise<void> {
    return this.$q.when(this._signUpSrv.setSignUpServer(signupUrl));
  }

  getAvailableDomains(signupToken: string|undefined): IPromise<string[]> {
    return this.$q.when(this._signUpSrv.getAvailableDomains(signupToken));
  }

  /**
   * read info about application users (on disk)
   */
  readRegisteredUser(): IPromise<string[]> {
    return this.$q.when(this._signInSrv.getUsersOnDisk());
  }

  /**
   * get available addresses for username
   * @param username {string}
   * @param signupToken
   * @return {angular.IPromise<string[]>}
   */
  getAvailableAddresses(
    username: string, signupToken: string|undefined
  ): IPromise<string[]> {
    return this.$q.when(
      this._signUpSrv.getAvailableAddresses(username, signupToken)
    );
  }

  /**
   * generate user secret keys
   * @param password {string}
   * @param cb {Function}
   */
  getLoginKey(password: string, cb: ((progress: number) => void)): IPromise<void> {
    return this.$q.when(this._signUpSrv.createUserParams(password, cb));
  }

  /**
   * create new account
   * @param login {string}
   * @param signupToken
   * @return {angular.IPromise<boolean>}
   */
  createNewAccount(
    login: string, signupToken: string|undefined
  ): IPromise<boolean> {
    return this.$q.when(this._signUpSrv.addUser(login, signupToken));
  }

  private getLoginOnDisk(): IPromise<string[]> {
    return this.$q.when(this._signInSrv.getUsersOnDisk());
  }

  /**
   * check login
   * @param login {string}
   * @return {angular.IPromise<boolean>}
   */
  private checkLogin(login: string): IPromise<boolean> {
    return this.$q.when(this._signInSrv.startLoginToRemoteStorage(login));
  }

  /**
   * signin user if account is on disk
   * @param login {string}
   * @param password {string}
   * @param cb {Function}
   */
  private signInFromDisk(login: string, password: string, cb: ((progress: number) => void)): IPromise<boolean> {
    return this.$q.when(this._signInSrv.useExistingStorage(login, password, cb));
  }

  /**
   * signin user if account isn't on disk
   * @param password {string}
   * @param cb {Function}
   */
  private signInFromNet(password: string, cb: ((progress: number) => void)) {
    return this.$q.when(this._signInSrv.completeLoginAndLocalSetup(password, cb));
  }


  /**
   * signin user if account isn't on disk
   * @param login {string}
   * @param password {string}
   * @param cb {Function}
   * @return {IPromise<{success: boolean, error: string, errorType: 'login' | 'password' | undefined}}
   */
  signIn(
      login: string,
      password: string,
      cb: ((progress: number) => void),
  ): IPromise<{success: boolean, error: string, errorType: string | undefined}> {
    return this.getLoginOnDisk()
      .then(logins => {
        if (logins.includes(login)) {
          // если пользователь уже пользовался данным приложением
          // и на диске имеется выбранный логин
          return this.signInFromDisk(login, password, cb)
            .then(passOk => {
              if (passOk) {
                return {success: true, error: '', errorType: undefined};
              } else {
                return {success: false, error: 'Passwod is incorrect!', errorType: 'password'};
              }
            })
            .catch(err => {
              console.error(err);
              return {success: false, error: 'Unknown error! Try again.', errorType: undefined};
            })
        } else {
          return this.checkLogin(login)
            .then(isAccountKnown => {
              if (isAccountKnown) {
                return this.signInFromNet(password, cb)
                  .then(passOk => {
                    if (passOk) {
                      return {success: true, error: '', errorType: undefined};
                    } else {
                      return {success: false, error: 'Passwod is incorrect!', errorType: 'password'};
                    }
                  })
                  .catch(err => {
                    console.error(err);
                    return {success: false, error: 'Unknown error! Try again.', errorType: undefined};
                  })
              } else {
                return {success: false, error: `Username ${login} is unknown!`, errorType: 'login'};
              }
            })
        }
      })
      .catch(err => {
        console.error(err);
        let errorText = 'Unknown error! Try again.';
        let errorType = undefined;
        let domain = login.substring(login.indexOf('@')+1);

        if (!!err.domainNotFound) {
          errorText = `Error. Domain ${domain} not found. Have you entered correct username with domain section?`;
          errorType = 'login';
        }

        if (!!err.noServiceRecord) {
          errorText = `Error. Server at ${domain} isn't configured with 3N protocols. Have you entered correct username with domain section?`;
          errorType = 'login';
        }

        return {success: false, error: errorText, errorType: errorType};
      })
  }


}
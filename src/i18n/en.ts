/*
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
*/

export const en = {
  signin: {
    title: 'Sign In',
    // welcome: 'Welcome, {username}',
    // opt: {
    //   other_login: 'Other Login',
    // },
    btn: {
      // sign_in: 'Sign In',
      enter: 'Enter',
      entering: 'Entering ... {percent}%',
      make_account: 'Create New Account',
    },
    make_account: {
      txt: `Don't have an account? Create one!`,
    },
  },

  field: {
    label: {
      login: 'Login',
      // custom_srv_url: 'Custom Service URL',
      // opt_token: 'Optional Signup Token',
      // username: 'Login',
      password: 'Password',
      confirm_password: 'Confirm Password',
    },
  },

  placeholder: {
    login: `Enter your Login e.g. user{'@'}privacysafe.me`,
    enter_password: 'Enter your Password',
    // custom_srv_url: 'Example: www.supersafe.online',
    // username: 'Enter Desired Username',
    create_password: 'Create Your Password',
    confirm_password: 'Repeat Your Password',
  },

  signup: {
    title: 'Create New Account',
    choice: {
      // title: 'Select Provider',
      // txt: 'Continue with our PrivacySafe Service, or enter a link from your own service provider below.',
      // btn: {
      //   custom_provider: 'Continue with Custom Service',
      //   privacysafe_std: 'Continue with PrivacySafe Service',
      //   privacysafe_token: 'Special Service from PrivacySafe',
      //   not_available: ' ',
      // },
      // label: {
      //   singup_link: 'Enter Token or Sign Up Link, if you have one',
      // },
      // long_process: 'Connecting to {url} ... {seconds} seconds',
      status: {
        have_domains_without_token: 'Signup domains available without token',
        have_domains_with_token: 'Domains available with token',
        no_domains_without_token: 'No domains. May need token.',
        no_domains_with_token: 'No domains. Is token correct?',
      },
      err: {
        no_connect: 'Fail to connect. Is url correct?',
        non_ok_status: 'Server replies funny ({status}). Is url correct?',
        general: 'Error occurred. Is url correct? Is device online?',
      },
    },
    step: {
      count: 'Step {num} of {total}: {text}',
      text1: 'Select Provider',
      text2: 'Create Username',
      text3: 'Create Password',
      text4: 'Important Information',

      btn: {
        next: 'Next',
      },
      create_user: {
        // text: 'Create Username',
        txt: 'Username should be 6 upto 60 characters. You can use letters, numbers and some characters: - (hyphen), . (dot) or _ (underscore). You can use characters from any language.',
        domain_label: 'Register to domain',
        login_placeholder: 'Enter your Login e.g. alex',
        status: {
          // username_too_short: 'Username {username} is too short.',
          // username_too_long: 'Username {username} is too long.',
          // invalid_char: 'Character {char} is not allowed.',
          // addr_available: 'Address {address} is available.',
          addr_not_available: 'Address {address} is not available.',
        },
      },
      // user_domain: 'Register to Domain:',
      create_password: {
        label: 'Create Password',
        txt1: 'Your login password must be at least 12 characters.  You can use letters, numbers and some characters: ',
        txt2: 'You can use characters from any language.',
        // status: {
        //   invalid_char: 'Character {char} is not allowed.',
        //   password_too_short: 'Password is too short',
        //   passwords_not_same: 'Passwords are not the same.',
        // },
      },
      acknowledgments: {
        label: 'Important Acknowledgment',
        txt: {
          intro: 'Please read and acknowledge if you agree with followings:',
          check1: {
            p1: 'I confirm that I am 18 years of age or older.',
          },
          check2: {
            p1: 'I understand that it is ',
            p2: 'impossible to recover. ',
          },
          check3: {
            p1: 'I will keep a secure copy. We recommend you keep a non-digital copy, such as paper or etched metal, in a secure place.',
          },
          check4: {
            p1: 'I understand it is good practice to store my credentials in a secure place or share them with a trustee.',
          },
        },
        // btn: 'I Understand & Agree',
        btn: 'Create Account',
      },
      progress: {
        title: 'Privacy Key',
        txt: 'Please wait a few moments while your account keys are generated, and server creates an account for you. Do not close this window.',
        txt1: 'Key is generation ... {value}%',
      },
    },
    provider: {
      silver: {
        title: 'Silver',
        info: '{domain} identity',
      },
      gold: {
        title: 'Gold',
        info: '{domain} identity',
      },
      platinum: {
        title: 'Platinum',
        info: '{domain} identity',
      },
      // hackers: {
      //   title: 'Hackers',
      //   info: 'Host Your Own',
      // },
      enter_label: {
        part_1: 'Enter ',
        part_2: 'Token or Sign Up Link',
        part_3: ', if you have one',
      },
    },
    // create_user: {
    //   custom_provider: {
    //     txt: 'Create Username',
    //   },
    // },
  },

  'boot-screen': {
    title: {
      txt: 'Opening PrivacySafe for',
    },
    logs: {
      btn_show: 'View system boot messages',
      btn_hide: 'Hide system boot messages',
    },
  },

  err: {
    domain_not_found: 'Domain {domain} is not found. Is it entered correctly?',
    domain_has_no_srv: 'Domain {domain} has no service. Is it entered correctly?',
    // cant_connect_to_srv_on_domain: `Can't connect to service at {domain}`,
    incorrect_password: 'Incorrect password. Try again.',
    login_not_recognized: 'Login {login} is not recognized. Is it entered correctly?',
    incorrect_login: 'Incorrect login.',
    field_required: 'The field cannot be empty. ',
    login_length: 'Login must contain from 6 to 60 letters, numbers and allowed characters. ',
    login_characters: 'The login contains prohibited characters. ',
    password_length: 'Password must contain at least 12 characters. ',
    password_characters: 'The password contains prohibited characters. ',
    confirmation_err: 'Does not match the password entered.',
    singup_available_err: `Account wasn't created. Address {address} is no longer available. Try for another address`,
    singup_general_err:
      `Oops... We're so sorry, but something went wrong. Please close the app and try signup later.`,
    sign_in: 'SignIn error. Please try again later.',
    invalid_login: `The login must contain the {'@'} symbol. `,
  },
};

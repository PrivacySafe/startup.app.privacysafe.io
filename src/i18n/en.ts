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
    btn: {
      login: 'Log In',
      entering: 'Entering ... {percent}%',
      make_account: 'Create Account',
      or: 'OR'
    },
    make_account: {
      txt: `Don't have an account? Create one!`,
    },
    footer: {
      like_it: "Like what we do?",
      support_us: "Support Us"
    },
  },

  placeholder: {
    username: `Username`,
    enter_password: 'Password',
    create_password: 'Password',
    confirm_password: 'Confirm Password',
  },

  signup: {
    title: 'Create Username',
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
        username_length_txt: 'Username should be 6 upto 60 characters long.',
        username_chars_txt: 'Use latin letters, numbers and some characters: - (hyphen), . (dot) or _ (underscore).',
        txt: 'Username should be 6 upto 60 characters. You can use letters, numbers and some characters: - (hyphen), . (dot) or _ (underscore). You can use characters from any language.',
        domain_label: 'Register to domain',
        status: {
          addr_not_available: 'Address {address} is not available.',
        },
      },
      // user_domain: 'Register to Domain:',
      create_password: {
        pass_length_txt: 'Password should be at least 12 characters long.',
        pass_chars_txt: 'Use only latin letters, numbers and some characters: ',
        confirmation_txt: 'Passwords should match.',
        // status: {
        //   invalid_char: 'Character {char} is not allowed.',
        //   password_too_short: 'Password is too short',
        //   passwords_not_same: 'Passwords are not the same.',
        // },
      },
      acknowledgments: {
        title: 'Important Acknowledgment',
        txt: {
          intro: 'Please read and acknowledge if you agree with followings:',
          check1: {
            p1: 'I confirm that I am 18 years of age or older.',
          },
          check2: {
            p1: 'I understand that it is impossible to recover lost password.',
          },
          check3: {
            p1: 'I will keep a secure copy of my password. For example, keep a non-digital copy, such as paper or etched metal, in a secure place.',
          },
          check4: {
            p1: 'I understand it is good practice to store my credentials in a secure place or share them with a trustee.',
          },
        },
        btn: 'Create Account',
      },
      progress: {
        txt: 'Preparing Your Secure Zone...',
        key_generation_txt: 'Preparing Your Key...',
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
      custom_link: {
        input_placeholder: 'Token or Sign Up Link',
        footer_btn_part: 'Apply Token or Sign Up Link,',
        footer_txt_part: 'if you have any',
      },
    },
  },

  'boot-screen': {
    txt: 'Preparing Your Secure Zone...',
    logs: {
      summary: 'System boot messages:',
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

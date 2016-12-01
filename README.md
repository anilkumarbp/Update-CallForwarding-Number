Update-Forwarding-Number on an Extension
=======================

Update-Forwarding-Number on an Extension is a demo app that allows a RingCentral user/extension to update the forwarding number.

## Prerequisites

* Have a RingCentral Admin Account
* Be registered as a [RingCentral Developer](https://developers.ringcentral.com/)
* [Created your sandbox(aka: test or development) account](https://developer.ringcentral.com/library/tutorials/test-account.html) within the RingCentral Developer Portal
* All the Devices should have an **Emergency Address** assigned to their device / extension ( **Mandatory** )
* Are able to [create a new application](https://developer.ringcentral.com/my-account.html#/applications) using the RingCentral Developer Portal

## Installation

Clone the repository to your local system:
[_Optionally, you can fork it first, but will need to modify the URI in the following command to match your fork's GIT repository._]

```
git clone https://github.com/anilkumarbp/Update-CallForwarding-Number.git
```

Change your working directory to the newly cloned repository:
```
cd Update-CallForwarding-Number
```

Install dependencies using NPM:
```
npm install
```

### Development Environment Setup

Before operating the application for local development and testing, you will need to configure some RingCentral-specific environment variables.

You will need to create a `.env` file in the root directory of this application. We have created a file you can use as a template named `TMP.env`. Below are the steps to setup your development environment:

1. Rename `.env.tmpl` to `.env`. From the terminal in Mac or Linux environments: `mv .env.tmpl .env`
2. Open the `.env` for editing
3. Enter the indicated values:

    ## RC_Accounts
    * **RC_USERNAME=** Admin user's phone number
    * **RC_PASSWORD=** Admin user's password
    * **RC_EXTENSION=** Admin user's extension
    * **RC_APP_KEY=** Your application's `app_key`
    * **RC_APP_SECRET=** Your application's `app_secret`
    * **RC_ENVIRONMENT=** Either `sandbox` -OR- `production`
    * **RC_API_BASE_URL=** Only change when your application receives production access
    * **RC_CACHE_PREFIX=** To identify that it is an RC Account for the platform object
    * **RC_FORWARDING_NUMBER=Forwarding-Number ( E.164 format ) Provide the Forwarding number in the E.164 format


## Operation

To start this application locally:
```
node index.js
```

To run the unit tests:
```
npm test
```

## Dependencies

Current used RCSDK version for this demo is :
[RCSDK-3.0.0]


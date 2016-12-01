'use strict';

// Handle local development and testing
if (process.env.RC_ENVIRONMENT !== 'Production') {
    require('dotenv').config();
}

// CONSTANTS - obtained from environment variables
var PORT = process.env.PORT;


// Dependencies
var RC = require('ringcentral');
var helpers = require('ringcentral-helpers');
var http = require('http');



// VARS
var _devices = [];
var _extensionFilterArray = [];
var server = http.createServer();


// Initialize the sdk for RC
var sdk = new RC({
    server: process.env.RC_API_BASE_URL,
    appKey: process.env.RC_APP_KEY,
    appSecret: process.env.RC_APP_SECRET,
    cachePrefix: process.env.RC_CACHE_PREFIX
});


// Bootstrap Platform and Subscription
var platform = sdk.platform();
var subscription = sdk.createSubscription();

//login
login();


function login() {
    return platform.login({
        username: process.env.RC_USERNAME,
        password: process.env.RC_PASSWORD,
        extension: process.env.RC_EXTENSION,
        cachePrefix: process.env.RC_CACHE_PREFIX
    })
        .then(function (response) {
            console.log("The RC auth object is :", JSON.stringify(response.json(), null, 2));
            console.log("Succesfully logged into the RC Account");
            init();
        })
        .catch(function (e) {
            console.log("Login Error into the Ringcentral Platform :", e);
            throw e;
        });
}


// Start the server
server.listen(PORT);

/*
 Retreive answering rule list by ID or the extension
 */
function init(loginData) {

    function getExtensionAnsweringRule() {

        var extensionAnsweringList = [];
        return platform
            .get('/account/~/extension/~/answering-rule/business-hours-rule')
            .then(function (response) {

                console.log("The extension answering rule list is :", JSON.stringify(response.json(), null, 2));
                var data = response.json();

                extensionAnsweringList = data.forwarding.rules;
                console.log("The rules array is : ", extensionAnsweringList);

                return extensionAnsweringList;

            });

    }

    /*
     Loop until you capture all answeringRules for the Extension
     */
    return getExtensionAnsweringRule()
        .then(function (answeringRuleList) {
            console.log("************** The total extensions are : **********", answeringRuleList);
            return answeringRuleList;
        })
        .then(forwardingNumberRuleSelector)
        .then(UpdateForwardingNumber)
        .catch(function (e) {
            console.error(e);
            throw e;
        });

}

/*
 To generate the presence Event Filter for subscription
 */
function forwardingNumberRuleSelector(answeringRuleList) {
    var body;

    // console.log("The array is : ", JSON.stringify(answeringRuleList.json(),null,2));
    answeringRuleList.forEach(function(value){
        if(value.forwardingNumbers[0].phoneNumber === process.env.RC_FORWARDING_NUMBER) {

            var index = value.index;
            var ringCount = value.ringCount;
            var id = value.forwardingNumbers[0].id;

            return body = {forwarding: {rules: [
                        {
                            index: index,
                            ringCount: ringCount,
                            forwardingNumbers: [
                                {
                                    id: id
                                }
                            ]
                        }
                    ]
                }
            };
        }
    });

    return body;
}

function UpdateForwardingNumber(body) {

    console.log("The body is :", body);
    return platform
        .put('/account/~/extension/~/answering-rule/business-hours-rule', body)
        .then(function (response) {

            var data = response.json();
            console.log("The Response is :",JSON.stringify(response.json(), null, 2));

        })
        .catch(function (e) {
            console.error(e);
            throw e;
        });
}





// Server Event Listeners
server.on('request', inboundRequest);

server.on('error', function (err) {
    console.error(err);
});

server.on('listening', function () {
    console.log('Server is listening to ', PORT);
});

server.on('close', function () {
    console.log('Server has closed and is no longer accepting connections');
});

// Register Platform Event Listeners
platform.on(platform.events.loginSuccess, handleLoginSuccess);
platform.on(platform.events.loginError, handleLoginError);
platform.on(platform.events.logoutSuccess, handleLogoutSuccess);
platform.on(platform.events.logoutError, handleLogoutError);
platform.on(platform.events.refreshSuccess, handleRefreshSuccess);
platform.on(platform.events.refreshError, handleRefreshError);


// Server Request Handler
function inboundRequest(req, res) {
    //log.info('REQUEST: ', req);
}


/**
 * Platform Event Handlers
 **/
function handleLoginSuccess(data) {
    // UNCOMMENT TO VIEW LOGIN DATA
    //log.info('LOGIN SUCCESS DATA: ', data);
}

function handleLoginError(data) {
    log.info('LOGIN FAILURE DATA: ', data);
}

function handleLogoutSuccess(data) {
    log.info('LOGOUT SUCCESS DATA: ', data);
}

function handleLogoutError(data) {
    log.info('LOGOUT FAILURE DATA: ', data);
}

function handleRefreshSuccess(data) {
    log.info('REFRESH SUCCESS DATA: ', data);
}

function handleRefreshError(data) {
    log.info('REFRESH FAILURE DATA: ', data);
    log.info('Initialing Login again :');
    login();
}
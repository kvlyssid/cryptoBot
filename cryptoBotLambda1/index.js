'use strict';

const { WebClient } = require("@slack/client");
const { PriceIntent } = require("./intent/PriceIntent.js");
const { UsageIntent } = require("./intent/UsageIntent.js");

const intents = [new PriceIntent(), new UsageIntent()];
const client = new WebClient(process.env.BOT_OAUTH_TOKEN);

const CONTENT_TYPE = {
    APPLICATION_JSON: { "Content-type": "application/json" },
    TEXT_PLAIN: { "Content-type": "text/plain" }
};

const OK_RESPONSE = {
    statusCode: 200
};

const BAD_REQUEST = {
    statusCode: 400
};

const EVENT_TYPES = {
    URL_VERIFICATION: "url_verification",
    EVENT_CALLBACK: "event_callback"
};

exports.handler = (event, context, callback) => {
    let request = JSON.parse(event.body);
    if (tokenValidates(request.token)) {
        console.log("Received request: ", request);
        switch (request.type) {
            case EVENT_TYPES.URL_VERIFICATION:
                handleUrlVerification(request.challenge, callback);
                break;
            case EVENT_TYPES.EVENT_CALLBACK:
                callback(null, OK_RESPONSE);
                handleEventCallback(request, callback);
                break;
            default:
                callback(null, BAD_REQUEST);
                break;
        }
    }
    else
        callback(null, BAD_REQUEST);
};

function handleEventCallback(request, callback) {
    console.log("Event type is event_callback");
    let event = request.event;
    if (!isBotMessage(event)) {
        switch (event.type) {
            case 'message':
                intents.find(intent => intent.test(event.text))
                    .apply(event.text, event.channel);
                break;
            default:
                break;
        }
    }
}

function handleUrlVerification(challenge, callback) {
    console.log("Event type is url_verification");
    let response = OK_RESPONSE;
    response.headers = CONTENT_TYPE.TEXT_PLAIN;
    response.body = challenge;
    callback(null, response);
}

function tokenValidates(token) {
    return token === process.env.VERIFICATION_TOKEN;
}

function isBotMessage(event) {
    return event.subtype === 'bot_message';
}

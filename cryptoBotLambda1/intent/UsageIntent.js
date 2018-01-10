'use strict';

const { BasicIntent } = require("./BasicIntent.js")

class UsageIntent extends BasicIntent {
    constructor() {
        super();
    }

    test(message) {
        return true;
    }

    apply(message, channelId) {
        this.client.chat.postMessage(channelId, "Hi there! For now I can not do a lot but just wait!\n" +
            "At least I only send 1 message, not 1000").then((res) => {
            console.log('Message sent: ', res);
        }).catch(console.error);
    }
}

module.exports.UsageIntent = UsageIntent;

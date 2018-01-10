const { WebClient } = require("@slack/client");
const axios = require("axios");

class BasicIntent {

    constructor() {
        this.client = new WebClient(process.env.BOT_OAUTH_TOKEN);
        this.axios = axios;
    }


    test(message) {
        return false;
    }

    apply(entity,channelId) {}

}

module.exports.BasicIntent = BasicIntent
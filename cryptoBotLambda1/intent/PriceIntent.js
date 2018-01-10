"use strict";

const { BasicIntent } = require("./BasicIntent.js");

class PriceIntent extends BasicIntent {

    constructor() {
        super();
        this.intentValues = ["price", "rate", "value", "worth"];
        this.currencies = {
            "xrpeur": ["xrp/eur", "xrp", "ripple", "riple", "xrp to euro", "ripple to euro", "ripple in euro"],
            "xrpbtc": ["xrp/btc", "xrp to bitcoin", "ripple in bitcoin", "ripple to bitcoin"],
            "etheur": ["ether", "ethereum", "eth/eur", "ether to euro", "ether in euro"],
            "ethbtc": ["eth/btc", "ether to bitcoin", "ether in bitcoin"],
            "btceur": ["bitcoin", "btc", "btc/eur", "bitcoin to euro", "bitcoin in euro"],
            "btcusd": ["bitcoin to usd", "bitcoin to dollars", "btc/usd"]
        }

    }

    test(message) {
        return this.intentValues.some(val => message.includes(val));
    }

    apply(message, channelId) {
        let self = this;
        let currency = determineCurrency();
        if (currency != undefined)
            acquireAndSendPrice();
        else
            sendCurrencyNotFound();

        function determineCurrency() {
            return Object.keys(self.currencies).find(currency =>
                self.currencies[currency].some(value => message.toLowerCase().includes(value))
            );
        }

        function acquireAndSendPrice() {
            self.axios.get(`https://www.bitstamp.net/api/v2/ticker/${currency}/`).then(res => {
                let message = formatPriceMessage(res.data);
                self.client.chat.postMessage(channelId, message).then((res) => {
                    console.log('Message sent: ', res);
                }).catch(console.error);
            }).catch(console.error);
        }

        function sendCurrencyNotFound() {
            let message = "Sorry I could not understand for which currency you want me to get" +
                " price details :disappointed:";
            self.client.chat.postMessage(channelId, message).then((res) => {
                console.log('Message sent: ', res);
            }).catch(console.error);
        }

        function formatPriceMessage(data) {
            return `Last: ${data.last} \nHigh: ${data.high}\n Low: ${data.low}\nOpen: ${data.open}`;
        }
    }
}



module.exports.PriceIntent = PriceIntent;

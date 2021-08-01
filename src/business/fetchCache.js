const fetch = require("node-fetch");

const files = {
    "https://siasky.net/AABR0XVHg7SDyVKNk0xqHnkojFIzharCC3QtpyTLHYojDg": "withdraw_proving_key.bin",
    "https://siasky.net/CADe3pSNzXpMp4ZaNeyZMefnKv1fmRIsfuyP8EYOWpPLAA": "withdraw_verification_key.json",
    "https://siasky.net/AABPstSjFBuv3WUNXRnk4tc9NZ1rlt8S04ta8WzbqPH_NA": "withdraw.json",
};

const cache = {};

module.exports = async (url) => {
    let content = cache[url];

    return {
        json: async () => {
            if (content) {
                return content;
            } else if (files[url] && files[url].endsWith('.json')) {
                try {
                    cache[url] = require('../' + files[url]);
                    return cache[url];
                } catch (e) {
                    console.log(`file not found ../${files[url]}`);
                }
            }
            const response = await fetch(url);
            const json = await response.json();
            cache[url] = json;
            return json;
        },
        arrayBuffer: async () => {
            if (content) {
                return content;
            }
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            cache[url] = buffer;
            return buffer;
        }
    }
};

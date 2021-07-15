const fetch = require("node-fetch");
const cache = {};

module.exports = async (url) => {
    let content = cache[url];

    return {
        json: async () => {
            if (content) {
                return content;
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

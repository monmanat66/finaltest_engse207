var apiconfig = {
    development: {
        serverKey: '1aaZ!ARgAQGuQzp00D5D000000.mOv2jmhXkfIsjgywpCIh7.HZpc6vED1LCbc90DTaVDJwdNqbTW5r4uZicv8AFfkOE1ialqnR8UN5.wnAgh090h',
        parse_server : {
            hosturl  : 'https://localhost:4000/api',
            wsurl    : 'wss://localhost:4000',
            masterKey     : 'wallboardapi',
            clientKey     : 'wallboardapi',
            javascriptKey : 'wallboardapi',
            appId : "wallboardapi"
        }
    },
    production: {
        serverKey: '1aaZ!ARgAQGuQzp00D5D000000.mOv2jmhXkfIsjgywpCIh7.HZpc6vED1LCbc90DTaVDJwdNqbTW5r4uZicv8AFfkOE1ialqnR8UN5.wnAgh090h',
        parse_server : {
            hosturl  : 'https://lab-parse-server.se-rmutl.net/api',
            wsurl    : 'wss://lab-parse-server.se-rmutl.net',
            masterKey     : 'wallboardapi',
            clientKey     : 'wallboardapi',
            javascriptKey : 'wallboardapi',
            appId : "wallboardapi"
        }
    },

};
module.exports = apiconfig;

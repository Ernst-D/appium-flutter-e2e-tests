import { config } from './wdio.conf';

config.capabilities = [
    {
        browserName: 'chrome',
        "goog:chromeOptions":{
            binary: process.env.LOCAL_CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        }
    }
]

exports.config = config;
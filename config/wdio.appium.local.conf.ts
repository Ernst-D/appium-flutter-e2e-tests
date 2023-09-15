import { config } from './wdio.conf';

config.maxInstances = 1;
config.port = 4723;
config.path = "/";

config.capabilities = [ {
    "appium:platformName": 'ios',
    'appium:platformVersion': '16.4',
    'appium:deviceName': 'iPhone 14',
    'appium:automationName': 'Flutter',
    "appium:autoAcceptAlerts":true,
    'appium:app': "./Runner.app",
    "appium:wdaConnectionTimeout": process.env.DEBUG === "1" ? 600000 : 240000
} ];

config.services = [
    [ 'appium', {
        logPath: './logs',
    } ]
];

config.before = async function () {
    await driver.switchContext("NATIVE_APP");
    await driver.execute("mobile: terminateApp", { bundleId: "com.apple.mobilesafari" });
    await driver.switchContext("FLUTTER");
    debugger
};


exports.config = config;
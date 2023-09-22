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
    // note: we can use zipped '*.app' binaries, driver will handle itself unzip
    'appium:app': process.cwd()+"/app/Runner.app.zip",
    "appium:wdaConnectionTimeout": process.env.DEBUG === "1" ? 600000 : 240000,
    "appium:usePrebuiltWDA": true,
    // "appium:useXctestrunFile": true,
    "appium:derivedDataPath":process.cwd()+"/app/wda"
} ];

config.services = [
    [ 'appium', {
        logPath: './logs',
        args: {
            debugLogSpacing: true,
            logTimestamp: true,
            logNoColors: true
        }
    } ]
];

config.before = async function () {
    await driver.switchContext("NATIVE_APP");
    await driver.execute("mobile: terminateApp", { bundleId: "com.apple.mobilesafari" });
    await driver.switchContext("FLUTTER");
    debugger
};


exports.config = config;
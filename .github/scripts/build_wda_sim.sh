xcodebuild build-for-testing \
  -project $PWD/node_modules/appium-flutter-driver/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj \
  -derivedDataPath app/wda \
  -scheme WebDriverAgentRunner \
  -destination "platform=iOS Simulator,name=$DEVICE_NAME" \
  CODE_SIGNING_ALLOWED=NO
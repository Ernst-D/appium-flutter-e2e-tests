import { Given, Then, When } from "@wdio/cucumber-framework";
import { byValueKey } from "appium-flutter-finder";

const waitFor = async (finder: string, timeout = 2000) => await driver.execute("flutter:waitFor", finder, timeout);
const tap = async (finder: string) => driver.touchAction(
    // @ts-ignore
    { action: 'tap', element: { elementId: finder } }
);

Given("User opened the app", async function(){
    await driver.execute("flutter:waitForFirstFrame")
    debugger;
})

When('User tap "plus" widget', async function () {
    const plusFinder = byValueKey("counterView_increment_floatingActionButton");

    await waitFor(plusFinder);
    await tap(plusFinder);
    debugger;
})

Then('Count increasing by 1', async function () {
    const counterFinder = byValueKey('counter_value');

    await waitFor(counterFinder);
    const value = await driver.getElementText(counterFinder);

    expect(Number(value)).toEqual(1);
    debugger
})
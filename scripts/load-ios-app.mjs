import "zx/globals";
const { CODEMAGIC_API_KEY, APP_ID } = process.env;

const parseResponse = (res) => JSON.parse(res) 

async function getApp(appName = "appium-flutter-ci-app") {
    const res = await $`curl -H "Content-Type: application/json" \
    -H "x-auth-token: ${CODEMAGIC_API_KEY}" \
    --request GET https://api.codemagic.io/apps`;

    /**
     * @type {object[]}
     */
    const parsedRes = parseResponse(res.stdout)["applications"];

    const app = parsedRes.find((app)=> app["appName"] = appName);

    return app;
}

console.log((await getApp()));
process.exit(0)

const builds = async () => await $`curl -H "Content-Type: application/json" \
-H "x-auth-token: ${CODEMAGIC_API_KEY}" \
--request GET https://api.codemagic.io/builds?appId=${APP_ID}`;

// see: https://docs.codemagic.io/rest-api/artifacts/
const appLink = async (url) => await $`curl -H "x-auth-token: ${CODEMAGIC_API_KEY}" \
--request GET ${url}`.pipe(process.stdout);

const res = await builds();

//latest app
const downloadUrl = JSON.parse(res.stdout)["builds"][0]["artefacts"][0]["url"];

console.log(JSON.parse(res.stdout)["builds"]);
console.log(downloadUrl);


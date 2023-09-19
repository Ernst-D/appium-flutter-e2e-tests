import "zx/globals";

$.verbose = false;

const { CODEMAGIC_API_KEY, APP_NAME } = process.env;

function parseResponse (res) {
    return JSON.parse(res);
}

/**
 * 
 * @param {string} appName 
 * @returns {Promise<{ [x: string]: any, "_id": string }>}}
 */
async function getApp() {
    if(APP_NAME == null) {
        throw new Error("APP_NAME variable is undefined")
    }

    const res = await $`curl -H "Content-Type: application/json" \
    -H "x-auth-token: ${CODEMAGIC_API_KEY}" \
    --request GET https://api.codemagic.io/apps`;

    /**
     * @type {object[]}
     */
    const parsedRes = parseResponse(res.stdout)["applications"];

    const app = parsedRes.find((app)=> app["appName"] = APP_NAME);

    return app;
}

const appId = (await getApp())._id;
async function getBuilds(appId) {
    const res = await $`curl -H "Content-Type: application/json" \
    -H "x-auth-token: ${CODEMAGIC_API_KEY}" \
    --request GET https://api.codemagic.io/builds?appId=${appId}`;

    return parseResponse(res.stdout);
};

console.log(await getBuilds(appId));
process.exit(0)


// see: https://docs.codemagic.io/rest-api/artifacts/
const appLink = async (url) => await $`curl -H "x-auth-token: ${CODEMAGIC_API_KEY}" \
--request GET ${url}`.pipe(process.stdout);

const res = await builds();

//latest app
const downloadUrl = JSON.parse(res.stdout)["builds"][0]["artefacts"][0]["url"];

console.log(JSON.parse(res.stdout)["builds"]);
console.log(downloadUrl);


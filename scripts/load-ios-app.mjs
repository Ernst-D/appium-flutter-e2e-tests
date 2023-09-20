import "zx/globals";

$.verbose = false;

const { CODEMAGIC_API_KEY, APP_NAME } = process.env;

function parseResponse (res) {
    return JSON.parse(res);
}

/**
 * 
 * @param {string} appName 
 * @returns {Promise<{ [x: string]: any, "_id": string, "workflows": object }>}}
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

async function findWorkflow(name, codemagicApp){
    const res = codemagicApp.workflows;

    return Object.values(res).find(workflow => workflow.name === name);
}

const appId = (await getApp())._id;
const workflowName = await findWorkflow("ios_sim_dev_driver", await getApp());

// console.log(workflowName);

// note: maybe we can try to send build["_id"] in webhook somehow
async function getBuilds(appId) {
    const res = await $`curl -H "Content-Type: application/json" \
    -H "x-auth-token: ${CODEMAGIC_API_KEY}" \
    --request GET https://api.codemagic.io/builds?appId=${appId}&workflowId=${workflowName["_id"]}`;

    return parseResponse(res.stdout);
};

/**
 * 
 * @param {object[]} builds 
 * @param {string} id 
 * 
 * @returns {object[]}
 */
function getBuildsById(builds, id){
    const res = builds.filter(build => build.workflowId === id)
    return res;
}

/**
 * 
 * @param { Array<{ [x: string]: any, index: number }> } obj 
 * @returns {object[]}
 */
const sorted = (obj) => obj.sort((a,b) => b.index - a.index)

console.log(
    sorted(
        getBuildsById((await getBuilds(appId))["builds"], workflowName["_id"]) 
    )
    .at(0)
    );
process.exit(0)


// see: https://docs.codemagic.io/rest-api/artifacts/
const appLink = async (url) => await $`curl -H "x-auth-token: ${CODEMAGIC_API_KEY}" \
--request GET ${url}`.pipe(process.stdout);

const res = await builds();

//latest app
const downloadUrl = JSON.parse(res.stdout)["builds"][0]["artefacts"][0]["url"];

console.log(JSON.parse(res.stdout)["builds"]);
console.log(downloadUrl);


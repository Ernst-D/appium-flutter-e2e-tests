// @ts-check

import "zx/globals";

// $.verbose = false;

const { CODEMAGIC_API_KEY, APP_NAME } = process.env;

/**
 * 
 * @param {object} res 
 * @returns 
 */
function parseResponse (res) {
    try {
        return JSON.parse(res);
    } catch (error) {
        throw new Error("Error in parsing JSON response")
    }
}

/**
 * 
 * @returns {Promise<{ [x: string]: any, "_id": string, "workflows": object } >}}
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

/**
 * @param {string} name
 * @param {Promise<{[x: string]: any;"_id": string;"workflows": object;}>}  } app
 * @returns
 * @param {{ [x: string]: any; _id?: string; workflows: any; }} app
 */
async function findWorkflow(name, app){
    const res = app.workflows;

    return Object.values(res).find(workflow => workflow.name === name);
}

/**
 * note: maybe we can try to send build["_id"] in webhook somehow
 * @param {object} appId
 * @param {{ [x: string]: any; }} workflowName
 */
async function getBuilds(appId, workflowName, branchName = "main") {
    const res = await $`curl -H "Content-Type: application/json" \
    -H "x-auth-token: ${CODEMAGIC_API_KEY}" \
    --request GET https://api.codemagic.io/builds?appId=${appId}&workflowId=${workflowName["_id"]}&branch=${branchName}`;

    return parseResponse(res.stdout);
};

/**
 * 
 * @param {object[]} builds 
 * @param {string} workflowId 
 * 
 * @returns {object[]}
 */
function getBuildsById(builds, workflowId){
    const res = builds.filter(build => build.workflowId === workflowId)
    return res;
}

/**
 * 
 * @param { Array<{ [x: string]: any, index: number }> } obj 
 * @returns {object}
 */
function getLatestBuildByIndex(obj){
    return obj.sort((a,b) => b.index - a.index).at(0);
}

/**
 * 
 * @param {string} url secure url from build API response
 * @param {number} expirationTime URL expiration UNIX timestamp in SECONDS
 * @returns {Promise<{ url: string, expiresAt: string }>}
 */
async function createArtifactPublicUrl(url, expirationTime){
    const publicUrl = url+"/public-url";
    const seconds = Math.round(Date.now() / 1000) + expirationTime;

    const curl = await $`curl -H "Content-Type: application/json" \
    -H "x-auth-token: ${CODEMAGIC_API_KEY}" \
    -d '{"expiresAt": ${seconds}}' \
    -X POST ${publicUrl}`;

    return parseResponse(curl.stdout);
}

/**
 * @param {string} publicUrl
 */
async function downloadApp(publicUrl){
    $`wget -O Runner.app.zip ${publicUrl}`.pipe(process.stdout)
}

const appId = (await getApp())._id;

const workflow = await findWorkflow("ios_sim_dev_driver", await getApp());
const workflowId = workflow["_id"];

const builds = (await getBuilds(appId, workflowId))["builds"]
const driverBuilds = getBuildsById(builds, workflowId);
const latestDriverBuild = getLatestBuildByIndex(driverBuilds);

const artifact = latestDriverBuild["artefacts"][0];

const secureDownloadUrl = artifact["url"];
const publicDownloadUrl = (await createArtifactPublicUrl(secureDownloadUrl, 300))["url"];

console.log(publicDownloadUrl);

await downloadApp(publicDownloadUrl)

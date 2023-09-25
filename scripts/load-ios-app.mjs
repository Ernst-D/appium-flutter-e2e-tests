// @ts-check

import "zx/globals";

const { CODEMAGIC_API_KEY, APP_NAME, APP_TYPE, WORKFLOW_NAME } = process.env;
const appTypes = {
    app: "app",
    apk: "apk",
    ipa: "ipa"
}

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
 * @param {string | undefined} name
 * @param {{[x: string]: any;"_id": string;"workflows": object;}} app
 * @returns
 * @param {{ [x: string]: any; _id?: string; workflows: any; }} app
 */
async function findWorkflow(name, app){
    if(name == null){
        throw new Error("Workflow name to lookup is null or undefined");
    }
    const workflows = app.workflows;
    const res = Object.values(workflows).find(workflow => workflow.name === name);
    
    if(!res){
        throw new Error("Workflow is either undefined or not found based on its name, please check WORKFLOW_NAME env variable");
    }

    return res;
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
 * @param { Array<{ [x: string]: any, index: number }> } builds 
 * @returns {object}
 */
function getLatestBuildByIndex(builds){
    return builds.sort((a,b) => b.index - a.index).at(0);
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
    await $`wget -O Runner.app.zip ${publicUrl}`.pipe(process.stdout)
}

function findArtefactByType(artefacts){
    if(APP_TYPE == null){
        throw new Error("App type to look in build's artifacts is null or undefined")
    }
    const artefact = artefacts.find(artefact => artefact.type === appTypes[APP_TYPE]);

    if(!artefact){
        throw new Error("Could not find related build artefact, please check APP_TYPE env variable")
    }

    return artefacts.find(artefact => artefact.type === appTypes[APP_TYPE]) 
}

const appId = (await getApp())._id;

const workflow = await findWorkflow(WORKFLOW_NAME, await getApp());
const workflowId = workflow["_id"];

const builds = (await getBuilds(appId, workflowId))["builds"]
const driverBuilds = getBuildsById(builds, workflowId);
const latestDriverBuild = getLatestBuildByIndex(driverBuilds);

const artifact = findArtefactByType(latestDriverBuild["artefacts"]);

const secureDownloadUrl = artifact["url"];

const publicDownloadUrl = (await createArtifactPublicUrl(secureDownloadUrl, 300))["url"];

await downloadApp(publicDownloadUrl)

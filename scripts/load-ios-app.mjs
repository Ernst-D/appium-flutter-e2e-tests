import "zx/globals";
const { CODEMAGIC_API_KEY, APP_ID } = process.env;

async function apps() {
    await $`curl -H "Content-Type: application/json" \
    -H "x-auth-token: ${CODEMAGIC_API_KEY}" \
    --request GET https://api.codemagic.io/apps`;
}

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


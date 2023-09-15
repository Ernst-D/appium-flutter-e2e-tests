import "zx/globals";
const { CODEMAGIC_API_KEY, APP_ID } = process.env;

const apps = async () => await $`curl -H "Content-Type: application/json" \
-H "x-auth-token: ${CODEMAGIC_API_KEY}" \
--request GET https://api.codemagic.io/apps`;

const builds = async () => await $`curl -H "Content-Type: application/json" \
-H "x-auth-token: ${CODEMAGIC_API_KEY}" \
--request GET https://api.codemagic.io/builds?appId=${APP_ID}`;

const res = await builds();

console.log(JSON.parse(res.stdout));
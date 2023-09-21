import "zx/globals"

const token = process.env.GH_TOKEN;
const command = $`curl -X POST -H "Accept: application/vnd.github+json" -H "Authorization: Bearer ${token}" https://api.github.com/repos/Ernst-D/appium-flutter-e2e-tests/actions/workflows/dispatch_example.yml/dispatches -d '{"ref":"main","inputs":{"logLevel":"warning","tags":false}}'`

await command.pipe(process.stdout);
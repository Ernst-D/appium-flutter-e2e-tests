curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GH_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/Ernst-D/appium-flutter-e2e-tests/actions/workflows/dispatch_example.yml/dispatches \
  -d '{"ref":"main"}'
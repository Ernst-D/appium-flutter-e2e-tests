import { existsSync, rmSync } from "fs";

import cucumberJson from "./cucumber-json";

export function removeReportFolderIfExists(folder = "./reports") {
    if (existsSync(folder)) {
        rmSync(folder, { recursive: true });
    } 
}

export const cucumberReporter = cucumberJson;
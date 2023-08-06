import type { RemoteCapabilities } from "@wdio/types/build/Capabilities";
import CucumberJsJsonReporter from "wdio-cucumberjs-json-reporter";
import { AttachmentType, CucumberAttachmentData } from "wdio-cucumberjs-json-reporter/dist/types";
import htmlReporter, { Options } from 'cucumber-html-reporter';


class CucumberJsonReporter {

    private getDateSuffix() {
        let date = new Date();

        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
      
        let formattedDate = `${year}${month}${day}`;
      
        return formattedDate;
    }

    attach(data: CucumberAttachmentData, type: AttachmentType) {
        return CucumberJsJsonReporter.attach(data, type);
    }

    generateCucumberHtmlReport(capabilities: RemoteCapabilities) {
        const options: Options = {
            theme: 'bootstrap',
            jsonDir: 'reports/new/',
            output: `reports/test-report-${this.getDateSuffix()}.html`,
            brandTitle: "Mobile end-to-end tests",
            columnLayout:1,
            reportSuiteAsScenarios: true,
            scenarioTimestamp: true,
            ignoreBadJsonFile: true,
            launchReport: !!process.env.LAUNCH_REPORT,
            //@ts-ignore
            failedSummaryReport: true,
        };
            
        return htmlReporter.generate(options); 
    }
}

export default new CucumberJsonReporter();
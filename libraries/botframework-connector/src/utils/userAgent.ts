import * as os from "os";

export type TelemetryInfo = { key?: string; value?: string };

export function getDefaultUserAgentValue(): string {
    const runtimeInfo = getRuntimeInfo();
    const platformSpecificData = getPlatformSpecificData();
    const userAgent = getUserAgentString(runtimeInfo.concat(platformSpecificData));
    return userAgent;
}
  
function getRuntimeInfo(): TelemetryInfo[] {
    const msRestRuntime = {
        key: "core-http",
        value: "3.0.4",
    };

    return [msRestRuntime];
}

function getPlatformSpecificData(): TelemetryInfo[] {
    const runtimeInfo = {
        key: "Node",
        value: process.version,
    };

    const osInfo = {
        key: "OS",
        value: `(${os.arch()}-${os.type()}-${os.release()})`,
    };

    return [runtimeInfo, osInfo];
}

function getUserAgentString(
    telemetryInfo: TelemetryInfo[],
    keySeparator = " ",
    valueSeparator = "/"
  ): string {
    return telemetryInfo
      .map((info) => {
        const value = info.value ? `${valueSeparator}${info.value}` : "";
        return `${info.key}${value}`;
      })
      .join(keySeparator);
} 

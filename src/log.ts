import type { YaoApplication } from "./yao";

/**
 * 日志对象
 */
export class Log {
  static with(c: YaoApplication): typeof Log {
    Log.client = c;
    return Log
  }
  static client: YaoApplication

  static Trace(format: string, ...args: any[]) {
    const payload = {
      type: "Log",
      method: "Trace",
      args: [format, ...args],
    };
    return Log.client.request({}, payload);
  }
  static Debug(format: string, ...args: any[]) {
    const payload = {
      type: "Log",
      method: "Debug",
      args: [format, ...args],
    };
    return Log.client.request({}, payload);
  }
  static Info(format: string, ...args: any[]) {
    const payload = {
      type: "Log",
      method: "Info",
      args: [format, ...args],
    };
    return Log.client.request({}, payload);
  }
  static Warn(format: string, ...args: any[]) {
    const payload = {
      type: "Log",
      method: "Warn",
      args: [format, ...args],
    };
    return Log.client.request({}, payload);
  }
  static Error(format: string, ...args: any[]) {
    const payload = {
      type: "Log",
      method: "Error",
      args: [format, ...args],
    };
    return Log.client.request({}, payload);
  }
  static Fatal(format: string, ...args: any[]) {
    const payload = {
      type: "Log",
      method: "Fatal",
      args: [format, ...args],
    };
    return Log.client.request({}, payload);
  }
  static Panic(format: string, ...args: any[]) {
    const payload = {
      type: "Log",
      method: "Panic",
      args: [format, ...args],
    };
    return Log.client.request({}, payload);
  }
};

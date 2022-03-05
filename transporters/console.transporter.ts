import {
  ICapturedPayload,
  ILogMessage,
  LogLevel,
  TransportTemplate,
} from "../logger.interface";
import { AbstractTransporter } from "./base.transporter";

/**
 * Default ConsoleTransporter template
 */
const defaultConsoleTransporterTemplate = <T extends ILogMessage>(
  p: ICapturedPayload
) =>
  ({
    message: p.message,
    timestamp: p.timestamp,
    payload: p.payload,
  } as T);

/**
 * Console transporter
 */
export default class ConsoleTransporter<
  T extends ILogMessage
> extends AbstractTransporter<T> {
  /**
   * @param template optional if not given, using default (no template, as message comes is written)
   */
  constructor(template?: TransportTemplate<T>) {
    super(template || defaultConsoleTransporterTemplate);
  }

  /**
   * writes payload in console
   */
  doWrite({ timestamp, message, payload }: T, level: LogLevel): void {
    switch (level) {
      case LogLevel.Info:
        return console.info(timestamp, message, payload);
      case LogLevel.Debug:
        return console.debug(timestamp, message, payload);
      case LogLevel.Warn:
        return console.warn(timestamp, message, payload);
      case LogLevel.Error:
        return console.error(timestamp, message, payload);
      default:
        return console.log(timestamp, message, payload);
    }
  }
}

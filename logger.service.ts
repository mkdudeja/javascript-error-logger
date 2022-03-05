import {
  ICapturedPayload,
  ILogger,
  ILoggerConfiguration,
  ILogMessage,
  ITransporter,
  LogLevel,
} from "./logger.interface";
import ConsoleTransporter from "./transporters/console.transporter";
import HttpTransporter from "./transporters/http.transporter";

/**
 * Default Logger implementation
 */
export class LoggerService<T extends ILogMessage> implements ILogger {
  private level: LogLevel;
  private transporters: Array<ITransporter<T>>;

  constructor(config: ILoggerConfiguration<T>) {
    this.level = config.level;
    this.transporters = config.transporters.filter(Boolean);
  }

  log(message: string, ...args: Array<any>) {
    return this.logWith(LogLevel.Log, message, ...args);
  }

  /**
   * Logs a info message
   * @param message
   */
  info(message: string, ...args: Array<any>): void {
    this.logWith(LogLevel.Info, message, ...args);
  }

  /**
   * Logs debug action messages
   * @param message
   */
  debug(message: string, ...args: Array<any>): void {
    this.logWith(LogLevel.Debug, message, ...args);
  }

  /**
   * Logs warning level messages
   * @param message
   */
  warn(message: string, ...args: Array<any>): void {
    this.logWith(LogLevel.Warn, message, ...args);
  }

  /**
   * Logs error messages
   * @param error
   */
  error(message: string, ...args: Array<any>): void {
    this.logWith(LogLevel.Error, message, ...args);
  }

  /**
   * If payload evaluates as should be logged then a macro-task is scheduled
   * @param logLevel
   * @param payload
   */
  private logWith(logLevel: LogLevel, logMessage: string, ...args: Array<any>) {
    if (this.isEventLevelLessThanLogLevel(logLevel)) {
      // capture payload, timestamp and level
      const capturedPayload: ICapturedPayload = {
        payload: args,
        level: logLevel,
        message: logMessage,
        timestamp: new Date().getTime(),
      };

      // send captured payload to each transporter to be written
      for (const transport of this.transporters) {
        this.execute(transport, capturedPayload, logLevel);
      }
    }
  }

  /**
   * A log-able payload is it which it's log level is less or equal to configured log level
   * @param logLevel
   * @param payload
   */
  private isEventLevelLessThanLogLevel(logLevel: LogLevel): boolean {
    return this.level >= logLevel;
  }

  /**
   * Queues the logging event as a micro-task
   * @param transport
   * @param payload
   * @param level
   */
  private execute(
    transport: ITransporter<T>,
    capturedPayload: ICapturedPayload,
    level: LogLevel
  ) {
    // send to event queue to minimize the stack processing for the application
    queueMicrotask(() => transport.write(capturedPayload, level));
  }
}

const queryParams = new URLSearchParams(window.location.search),
  transporter = [new ConsoleTransporter()],
  prodTransporter = [new HttpTransporter()],
  isDebugMode = Boolean(parseInt(queryParams.get("debug"), 10)),
  isProdEnv = !isDebugMode && process.env.NODE_ENV === "production";

export default new LoggerService({
  level: LogLevel.Log,
  transporters: isProdEnv ? prodTransporter : transporter,
});

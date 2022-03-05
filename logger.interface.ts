/**
 * Allowed Log input types
 */
export enum LogLevel {
  Log = 5,
  Debug = 4,
  Info = 3,
  Warn = 2,
  Error = 1,
}

/**
 * Logger Interface. Implementations should implement and expose the following methods: info, debug, warn, error
 */
export interface ILogger {
  log(msg: string, meta?: Array<any>): void;
  debug(msg: string, meta?: Array<any>): void;
  info(msg: string, meta?: Array<any>): void;
  warn(msg: string, meta?: Array<any>): void;
  error(msg: string, meta?: Array<any>): void;
}

/**
 * LoggerConfiguration object interface
 */
export interface ILoggerConfiguration<T> {
  level: LogLevel;
  transporters: Array<ITransporter<T>>;
}

/**
 * Final captured event, built-in Logger captures this instance
 * before queuing the transport macro task execution, if custom
 * Logger implemented it's highly recommended to capture this
 * instance before the transporters write processing
 */
export interface ICapturedPayload {
  level: LogLevel;
  message: string;
  payload: Array<any>;
  timestamp: number;
}

/**
 * Logger Transporters
 */
export interface ITransporter<T> {
  write: (payload: ICapturedPayload, level?: LogLevel) => void;
  doWrite(payload: T, level?: LogLevel): void;
}

export type TransportTemplate<T> = (p: ICapturedPayload) => T;

export interface ILogMessage {
  message: string;
  payload: Array<any>;
  timestamp: number;
}

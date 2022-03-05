import {
  ICapturedPayload,
  ITransporter,
  LogLevel,
  TransportTemplate,
} from "../logger.interface";

/**
 * Base Transporter implementation
 */
export abstract class AbstractTransporter<T> implements ITransporter<T> {
  template: TransportTemplate<T>;

  constructor(template: TransportTemplate<T>) {
    this.template = template;
  }

  write(payload: ICapturedPayload, level?: LogLevel) {
    const templatedPayload = this.template(payload);
    this.doWrite(templatedPayload, level);
  }

  abstract doWrite(payload: T, level?: LogLevel): void;
}

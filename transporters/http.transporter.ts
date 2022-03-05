import { EMPTY, of, Subject } from "rxjs";
import {
  buffer,
  catchError,
  debounceTime,
  switchMap,
  take,
} from "rxjs/operators";
import {
  ICapturedPayload,
  ILogMessage,
  LogLevel,
  TransportTemplate,
} from "../logger.interface";
import { AbstractTransporter } from "./base.transporter";

interface LogBatch<T> {
  level: LogLevel;
  payload: T;
}

/**
 * Default ConsoleTransporter template
 */
const defaultHttpTransporterTemplate = <T extends ILogMessage>(
  p: ICapturedPayload
) =>
  ({
    message: p.message,
    timestamp: p.timestamp,
    payload: p.payload,
  } as T);

/**
 * HTTP transporter
 */
export default class HttpTransporter<
  T extends ILogMessage
> extends AbstractTransporter<T> {
  batcher$ = new Subject<LogBatch<T>>();

  /**
   * @param template optional if not given, using default (no template, as message comes is written)
   */
  constructor(template?: TransportTemplate<T>) {
    super(template || defaultHttpTransporterTemplate);

    this.batcher$
      .pipe(
        buffer(this.batcher$.pipe(debounceTime(1500))),
        switchMap((batches) => this.toHttpRequests(batches))
      )
      .subscribe();
  }

  /**
   * Writes/sends payload to configured url and given Http Method
   */
  doWrite(payload: T, level: LogLevel): void {
    this.batcher$.next({ level, payload });
  }

  /**
   * Creates http observable with given params (url, httpMethod, level & payload)
   */
  private toHttpRequests(batches: Array<LogBatch<T>>) {
    const payload = batches.map((batch) => {
      return {
        payload: this._preparePayload(batch.payload),
        level: batch.level,
      };
    });

    return of("[HTTP_LIBRARY]".post("[ENDPOINT_URL]", payload)).pipe(
      take(1),
      catchError((error) => {
        // just in case LOL
        console.error("Error while logging message", payload, "Error:", error);
        return EMPTY;
      })
    );
  }

  private _preparePayload(message: ILogMessage) {
    message.payload = message.payload.map((row) => {
      if (row instanceof Error) {
        return row.stack;
      }
      return row;
    });

    return message;
  }
}

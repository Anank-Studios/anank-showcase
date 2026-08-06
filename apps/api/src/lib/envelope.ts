import type { ApiErrorBody, Envelope } from '@anank/contracts';

export function ok<T>(data: T): Envelope<T> {
  return { data, error: null };
}

export function fail(
  code: ApiErrorBody['code'],
  message: string,
  details?: ApiErrorBody['details']
): Envelope<never> {
  return { data: null, error: details ? { code, message, details } : { code, message } };
}

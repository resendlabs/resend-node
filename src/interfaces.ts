import type { fetch } from 'undici';

export type Fetch = typeof fetch;

export type Options = {
  fetch?: Fetch;
  headers?: Record<string, string>;
};

export const RESEND_ERROR_CODES_BY_KEY = {
  missing_required_field: 422,
  invalid_access: 422,
  invalid_parameter: 422,
  invalid_region: 422,
  rate_limit_exceeded: 429,
  missing_api_key: 401,
  invalid_api_Key: 403,
  invalid_from_address: 403,
  validation_error: 403,
  not_found: 404,
  method_not_allowed: 405,
  application_error: 500,
  internal_server_error: 500,
} as const;

export type RESEND_ERROR_CODE_KEY = keyof typeof RESEND_ERROR_CODES_BY_KEY;

export interface ErrorResponse {
  message: string;
  name: RESEND_ERROR_CODE_KEY;
}

export type Tag = { name: string; value: string };

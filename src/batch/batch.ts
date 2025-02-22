import type * as React from 'react';
import type { EmailApiOptions } from '../common/interfaces/email-api-options.interface';
import { parseEmailToApiOptions } from '../common/utils/parse-email-to-api-options';
import type { Resend } from '../resend';
import type {
  CreateBatchOptions,
  CreateBatchRequestOptions,
  CreateBatchResponse,
  CreateBatchSuccessResponse,
} from './interfaces/create-batch-options.interface';

export class Batch {
  private renderAsync?: (
    component: React.ReactElement,
    options?: { plainText?: boolean },
  ) => Promise<string>;
  constructor(private readonly resend: Resend) {}

  async send(
    payload: CreateBatchOptions,
    options: CreateBatchRequestOptions = {},
  ): Promise<CreateBatchResponse> {
    return this.create(payload, options);
  }

  async create(
    payload: CreateBatchOptions,
    options: CreateBatchRequestOptions = {},
  ): Promise<CreateBatchResponse> {
    const emails: EmailApiOptions[] = [];

    for (const email of payload) {
      if (email.react) {
        if (!this.renderAsync) {
          try {
            const { renderAsync } = await import('@react-email/render');
            this.renderAsync = renderAsync;
          } catch (error) {
            throw new Error(
              'Failed to render React component. Make sure to install `@react-email/render`',
            );
          }
        }
        const reactElement = email.react as React.ReactElement;
        email.html = await this.renderAsync(reactElement);
        if (email.text === undefined) {
          email.text = await this.renderAsync(reactElement, {
            plainText: true,
          });
        }
        email.react = undefined;
      }

      emails.push(parseEmailToApiOptions(email));
    }

    const data = await this.resend.post<CreateBatchSuccessResponse>(
      '/emails/batch',
      emails,
      options,
    );

    return data;
  }
}

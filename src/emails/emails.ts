import type * as React from 'react';
import { parseEmailToApiOptions } from '../common/utils/parse-email-to-api-options';
import type { Resend } from '../resend';
import type {
  CancelEmailResponse,
  CancelEmailResponseSuccess,
} from './interfaces/cancel-email-options.interface';
import type {
  CreateEmailOptions,
  CreateEmailRequestOptions,
  CreateEmailResponse,
  CreateEmailResponseSuccess,
} from './interfaces/create-email-options.interface';
import type {
  GetEmailResponse,
  GetEmailResponseSuccess,
} from './interfaces/get-email-options.interface';
import type {
  UpdateEmailOptions,
  UpdateEmailResponse,
  UpdateEmailResponseSuccess,
} from './interfaces/update-email-options.interface';

export class Emails {
  private renderAsync?: (
    component: React.ReactElement,
    options?: { plainText?: boolean },
  ) => Promise<string>;
  constructor(private readonly resend: Resend) {}

  async send(
    payload: CreateEmailOptions,
    options: CreateEmailRequestOptions = {},
  ) {
    return this.create(payload, options);
  }

  async create(
    payload: CreateEmailOptions,
    options: CreateEmailRequestOptions = {},
  ): Promise<CreateEmailResponse> {
    if (payload.react) {
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

      const reactElement = payload.react as React.ReactElement;
      payload.html = await this.renderAsync(reactElement);
      if (payload.text === undefined) {
        payload.text = await this.renderAsync(reactElement, {
          plainText: true,
        });
      }
    }

    const data = await this.resend.post<CreateEmailResponseSuccess>(
      '/emails',
      parseEmailToApiOptions(payload),
      options,
    );

    return data;
  }

  async get(id: string): Promise<GetEmailResponse> {
    const data = await this.resend.get<GetEmailResponseSuccess>(
      `/emails/${id}`,
    );

    return data;
  }

  async update(payload: UpdateEmailOptions): Promise<UpdateEmailResponse> {
    const data = await this.resend.patch<UpdateEmailResponseSuccess>(
      `/emails/${payload.id}`,
      {
        scheduled_at: payload.scheduledAt,
      },
    );
    return data;
  }

  async cancel(id: string): Promise<CancelEmailResponse> {
    const data = await this.resend.post<CancelEmailResponseSuccess>(
      `/emails/${id}/cancel`,
    );
    return data;
  }
}

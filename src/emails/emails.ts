import type { ReactElement, JSXElementConstructor } from 'react';
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
import { renderReactEmail } from './render';

export class Emails {
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
    // Only attempt to render React components if the react option is provided
    if (payload.react) {
      try {
        payload.html = await renderReactEmail(
          payload.react as ReactElement<Record<string, unknown>, string | JSXElementConstructor<unknown>>
        );
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Failed to render React component: ${error.message}. Make sure to install '@react-email/render'`,
          );
        }
        throw error;
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

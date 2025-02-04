import { renderReactEmail } from './render';
import type { ReactElement } from 'react';

jest.mock('@react-email/render', () => ({
  renderAsync: jest.fn().mockResolvedValue('<div>Rendered Email</div>'),
}));

describe('renderReactEmail', () => {
  const mockComponent = {
    type: 'div',
    props: {} as Record<string, unknown>,
    key: null,
  } as ReactElement<Record<string, unknown>, string>;

  it('should render React component successfully', async () => {
    const result = await renderReactEmail(mockComponent);
    expect(result).toBe('<div>Rendered Email</div>');
  });

  it('should throw error when rendering fails', async () => {
    const { renderAsync } = require('@react-email/render');
    renderAsync.mockRejectedValueOnce(new Error('Render failed'));

    await expect(renderReactEmail(mockComponent)).rejects.toThrow(
      'Failed to render React component: Render failed'
    );
  });
}); 
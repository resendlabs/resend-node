import type { Options } from "@react-email/render";
import type { ReactElement, JSXElementConstructor } from "react";

// Define a more specific type for the render function
type RenderEmailFunction = (
  element: ReactElement<Record<string, unknown>, string | JSXElementConstructor<unknown>>,
  options?: Options
) => Promise<string>;

let renderAsyncCache: RenderEmailFunction | undefined;

export async function renderReactEmail(
  component: ReactElement<Record<string, unknown>, string | JSXElementConstructor<unknown>>,
  options?: Options
): Promise<string> {
  if (!renderAsyncCache) {
    try {
      // Dynamic import to ensure @react-email/render is only loaded when needed
      const { renderAsync } = await import('@react-email/render');
      renderAsyncCache = renderAsync as RenderEmailFunction;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to load @react-email/render: ${error.message}. Make sure to install the package.`
        );
      }
      throw error;
    }
  }

  try {
    return await renderAsyncCache(component, options);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to render React component: ${error.message}`);
    }
    throw error;
  }
} 
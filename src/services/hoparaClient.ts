import Hopara from '@hopara/iframe';

export interface HoparaClient {
  update: (input: {
    visualizationId: string;
    dataLoaders: Array<{
      source: string;
      query: string;
      loader: () => Promise<{ columns: Array<{ name: string; type: string }>; rows: Array<Record<string, unknown>> }>;
      cache: boolean;
    }>;
  }) => void;
  refresh: () => void;
}

export const createHoparaClient = (params: {
  embeddedUrl: string;
  targetElement: HTMLElement;
  debug: boolean;
}): HoparaClient => {
  return Hopara.init({
    embeddedUrl: params.embeddedUrl,
    targetElement: params.targetElement,
    debug: params.debug,
  }) as HoparaClient;
};

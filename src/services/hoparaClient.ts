import Hopara from '@hopara/iframe';

export interface HoparaClient {
  update: (input: {
    visualizationId: string;
    accessToken?: string;
    tenant?: string;
    dataLoaders: Array<{
      source: string;
      query: string;
      name?: string;
      loader: () => Promise<Array<Record<string, unknown>>>;
      cache: boolean;
    }>;
  }) => void;
  refresh: () => void;
}

export const createHoparaClient = (params: {
  embeddedUrl: string;
  targetElement: HTMLElement;
  debug: boolean;
  accessToken?: string;
  tenant?: string;
}): HoparaClient => {
  return Hopara.init({
    embeddedUrl: params.embeddedUrl,
    targetElement: params.targetElement,
    debug: params.debug,
    accessToken: params.accessToken,
    tenant: params.tenant,
  }) as HoparaClient;
};

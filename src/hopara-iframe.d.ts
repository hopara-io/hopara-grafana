declare module '@hopara/iframe' {
  interface HoparaInitParams {
    embeddedUrl: string;
    targetElement: HTMLElement;
    debug?: boolean;
    accessToken?: string;
    tenant?: string;
  }

  interface HoparaDataLoader {
    source: string;
    query: string;
    name?: string;
    loader: () => Promise<Array<Record<string, unknown>>>;
    cache?: boolean;
  }

  interface HoparaUpdateParams {
    visualizationId: string;
    dataLoaders: HoparaDataLoader[];
    accessToken?: string;
    tenant?: string;
  }

  interface HoparaInstance {
    update: (input: HoparaUpdateParams) => void;
    refresh: () => void;
  }

  const Hopara: {
    init: (params: HoparaInitParams) => HoparaInstance;
  };

  export default Hopara;
}

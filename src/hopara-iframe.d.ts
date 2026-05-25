declare module '@hopara/iframe' {
  interface HoparaInitParams {
    embeddedUrl: string;
    targetElement: HTMLElement;
    debug?: boolean;
  }

  interface HoparaDataLoader {
    source: string;
    query: string;
    loader: () => Promise<{
      columns: Array<{ name: string; type: string }>;
      rows: Array<Record<string, unknown>>;
    }>;
    cache?: boolean;
  }

  interface HoparaUpdateParams {
    visualizationId: string;
    dataLoaders: HoparaDataLoader[];
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

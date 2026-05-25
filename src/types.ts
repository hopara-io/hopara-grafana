export type MappingMode = 'manual' | 'inferred';

export interface QueryMapping {
  queryKey: string;
  refId: string;
  hoparaQueryValue: string;
  mappingMode: MappingMode;
}

export interface HoparaPanelOptions {
  embeddedUrl: string;
  visualizationUrl: string;
  datasetUrl: string;
  accessToken: string;
  visualizationId: string;
  mappings: QueryMapping[];
  allowInference: boolean;
  debug: boolean;
}

export const DEFAULT_OPTIONS: HoparaPanelOptions = {
  embeddedUrl: 'https://statics.hopara.app/embedded/latest',
  visualizationUrl: 'https://visualization.hopara.app/visualization',
  datasetUrl: 'https://dataset.hopara.app/view',
  accessToken: '',
  visualizationId: '',
  mappings: [],
  allowInference: true,
  debug: false,
};

export interface HoparaVisualization {
  id: string;
  name: string;
}

export interface HoparaDatasetQuery {
  dataSource: string;
  name: string;
  value: string;
}

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
  visualizationId: string;
  mappings: QueryMapping[];
  allowInference: boolean;
  debug: boolean;
}

export const DEFAULT_OPTIONS: HoparaPanelOptions = {
  embeddedUrl: '',
  visualizationUrl: '',
  datasetUrl: '',
  visualizationId: '',
  mappings: [],
  allowInference: true,
  debug: false,
};

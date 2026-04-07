import type { PanelMigrationHandler } from '@grafana/data';
import { DEFAULT_OPTIONS, HoparaPanelOptions } from './types';

type LegacyOptions = Partial<HoparaPanelOptions> & {
  apiUrl?: string;
};

export const migrationHandler: PanelMigrationHandler<HoparaPanelOptions> = (panel) => {
  const legacy = (panel.options ?? {}) as LegacyOptions;
  const sharedApiUrl = legacy.apiUrl ?? '';
  const { apiUrl: _apiUrl, ...legacyWithoutApiUrl } = legacy;

  return {
    ...DEFAULT_OPTIONS,
    ...legacyWithoutApiUrl,
    visualizationUrl: legacy.visualizationUrl ?? sharedApiUrl,
    datasetUrl: legacy.datasetUrl ?? sharedApiUrl,
    mappings: Array.isArray(legacy.mappings) ? legacy.mappings : [],
    allowInference: legacy.allowInference ?? true,
    debug: legacy.debug ?? false,
  };
};

import type { PanelModel } from '@grafana/data';
import { DEFAULT_OPTIONS, HoparaPanelOptions } from './types';

type LegacyOptions = Partial<HoparaPanelOptions> & {
  apiUrl?: string;
};

export const migrationHandler = (
  panel: PanelModel<LegacyOptions>
): PanelModel<HoparaPanelOptions> => {
  const legacy = panel.options ?? {};
  const sharedApiUrl = legacy.apiUrl ?? '';

  panel.options = {
    ...DEFAULT_OPTIONS,
    ...legacy,
    visualizationUrl: legacy.visualizationUrl ?? sharedApiUrl,
    datasetUrl: legacy.datasetUrl ?? sharedApiUrl,
    mappings: Array.isArray(legacy.mappings) ? legacy.mappings : [],
    allowInference: legacy.allowInference ?? true,
    debug: legacy.debug ?? false,
  };

  delete (panel.options as LegacyOptions).apiUrl;

  return panel as PanelModel<HoparaPanelOptions>;
};

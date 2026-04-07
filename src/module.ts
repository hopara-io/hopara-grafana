import { PanelPlugin } from '@grafana/data';
import { HoparaPanel } from './components/HoparaPanel';
import { migrationHandler } from './migrations';
import { DEFAULT_OPTIONS, HoparaPanelOptions } from './types';

export const plugin = new PanelPlugin<HoparaPanelOptions>(HoparaPanel)
  .setMigrationHandler(migrationHandler)
  .setPanelOptions((builder) => {
    return builder
      .addTextInput({
        path: 'embeddedUrl',
        name: 'Embedded URL',
        category: ['Connection'],
        defaultValue: DEFAULT_OPTIONS.embeddedUrl,
      })
      .addTextInput({
        path: 'visualizationUrl',
        name: 'Visualization URL',
        category: ['Connection'],
        defaultValue: DEFAULT_OPTIONS.visualizationUrl,
      })
      .addTextInput({
        path: 'datasetUrl',
        name: 'Dataset URL',
        category: ['Connection'],
        defaultValue: DEFAULT_OPTIONS.datasetUrl,
      })
      .addTextInput({
        path: 'visualizationId',
        name: 'Visualization ID',
        category: ['Visualization'],
        defaultValue: DEFAULT_OPTIONS.visualizationId,
      })
      .addBooleanSwitch({
        path: 'allowInference',
        name: 'Allow inference',
        category: ['Mappings'],
        defaultValue: DEFAULT_OPTIONS.allowInference,
      })
      .addBooleanSwitch({
        path: 'debug',
        name: 'Debug',
        category: ['Advanced'],
        defaultValue: DEFAULT_OPTIONS.debug,
      });
  });

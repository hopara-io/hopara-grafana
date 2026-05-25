import { PanelPlugin } from '@grafana/data';
import { HoparaPanel } from './components/HoparaPanel';
import { QueryMappingsEditor } from './components/editors/QueryMappingsEditor';
import { VisualizationSelectEditor } from './components/editors/VisualizationSelectEditor';
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
        path: 'accessToken',
        name: 'Access Token',
        category: ['Connection'],
        defaultValue: DEFAULT_OPTIONS.accessToken,
        settings: {
          placeholder: 'Bearer token',
          type: 'password',
        },
      })
      .addTextInput({
        path: 'tenant',
        name: 'Tenant',
        category: ['Connection'],
        defaultValue: DEFAULT_OPTIONS.tenant,
      })
      .addCustomEditor({
        id: 'visualizationId',
        path: 'visualizationId',
        name: 'Visualization',
        category: ['Visualization'],
        editor: VisualizationSelectEditor,
      })
      .addCustomEditor({
        id: 'mappings',
        path: 'mappings',
        name: 'Query mappings',
        category: ['Mappings'],
        editor: QueryMappingsEditor,
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

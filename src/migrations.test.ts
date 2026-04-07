import { migrationHandler } from './migrations';

describe('migrationHandler', () => {
  it('adds safe defaults for saved panels that only contain URLs', async () => {
    const migrated = await Promise.resolve(
      migrationHandler({
        id: 1,
        type: 'hopara-grafana-panel',
        options: {
          embeddedUrl: 'http://localhost:3000',
          visualizationUrl: 'http://localhost:3001/visualizations',
          datasetUrl: 'http://localhost:3002/datasets',
        },
        fieldConfig: {
          defaults: {},
          overrides: [],
        },
      } as any)
    );

    expect(migrated).toEqual({
      embeddedUrl: 'http://localhost:3000',
      visualizationUrl: 'http://localhost:3001/visualizations',
      datasetUrl: 'http://localhost:3002/datasets',
      visualizationId: '',
      mappings: [],
      allowInference: true,
      debug: false,
    });
  });

  it('splits a legacy apiUrl into visualizationUrl and datasetUrl', async () => {
    const migrated = await Promise.resolve(
      migrationHandler({
        id: 1,
        type: 'hopara-grafana-panel',
        options: {
          apiUrl: 'http://localhost:8080/api',
        },
        fieldConfig: {
          defaults: {},
          overrides: [],
        },
      } as any)
    );

    expect(migrated.visualizationUrl).toBe('http://localhost:8080/api');
    expect(migrated.datasetUrl).toBe('http://localhost:8080/api');
    expect(migrated).not.toHaveProperty('apiUrl');
  });
});

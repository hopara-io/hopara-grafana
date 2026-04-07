import { migrationHandler } from './migrations';

describe('migrationHandler', () => {
  it('adds safe defaults for saved panels that only contain URLs', () => {
    const panel = {
      options: {
        embeddedUrl: 'http://localhost:3000',
        visualizationUrl: 'http://localhost:3001/visualizations',
        datasetUrl: 'http://localhost:3002/datasets',
      },
    } as any;

    const migrated = migrationHandler(panel);

    expect(migrated.options).toEqual({
      embeddedUrl: 'http://localhost:3000',
      visualizationUrl: 'http://localhost:3001/visualizations',
      datasetUrl: 'http://localhost:3002/datasets',
      visualizationId: '',
      mappings: [],
      allowInference: true,
      debug: false,
    });
  });

  it('splits a legacy apiUrl into visualizationUrl and datasetUrl', () => {
    const panel = {
      options: {
        apiUrl: 'http://localhost:8080/api',
      },
    } as any;

    const migrated = migrationHandler(panel);

    expect(migrated.options.visualizationUrl).toBe('http://localhost:8080/api');
    expect(migrated.options.datasetUrl).toBe('http://localhost:8080/api');
  });
});

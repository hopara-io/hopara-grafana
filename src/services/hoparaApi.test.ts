import {
  fetchDatasetQueries,
  fetchVisualizations,
  toHoparaQueryValue,
} from './hoparaApi';

const mockFetch = (payload: unknown, init: Partial<Response> = {}) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: init.statusText ?? 'OK',
    json: async () => payload,
  }) as any;
};

describe('hoparaApi', () => {
  it('normalizes visualization responses', async () => {
    mockFetch([{ id: 'viz-1', name: 'Plant Overview' }]);

    await expect(fetchVisualizations('http://hopara.local/visualizations')).resolves.toEqual([
      { id: 'viz-1', name: 'Plant Overview' },
    ]);
  });

  it('normalizes dataset query responses and preserves Hopara query values', async () => {
    mockFetch([{ dataSource: 'plants', name: 'alarms' }]);

    const result = await fetchDatasetQueries('http://hopara.local/datasets');

    expect(result).toEqual([
      {
        dataSource: 'plants',
        name: 'alarms',
        value: 'plants:alarms',
      },
    ]);
    expect(toHoparaQueryValue(result[0])).toBe('plants:alarms');
  });

  it('throws a descriptive error when the endpoint returns a non-200 response', async () => {
    mockFetch({}, { ok: false, status: 503, statusText: 'Service Unavailable' });

    await expect(fetchDatasetQueries('http://hopara.local/datasets')).rejects.toThrow(
      'Hopara request failed for http://hopara.local/datasets: 503 Service Unavailable'
    );
  });
});

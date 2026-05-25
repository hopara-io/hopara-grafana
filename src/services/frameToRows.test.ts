import { FieldType, toDataFrame } from '@grafana/data';
import { frameToLoaderData } from './frameToRows';
import { listQueryIdentities } from './queryIdentity';

describe('frameToRows', () => {
  it('converts a Grafana frame into Hopara columns and rows', () => {
    const frame = toDataFrame({
      refId: 'A',
      name: 'Orders',
      fields: [
        { name: 'city', type: FieldType.string, values: ['Sao Paulo', 'Recife'] },
        { name: 'count', type: FieldType.number, values: [10, 20] },
        { name: 'price', type: FieldType.number, values: [10.5, 20.9] },
        { name: 'active', type: FieldType.boolean, values: [true, false] },
      ],
    });

    expect(frameToLoaderData(frame)).toEqual({
      columns: [
        { name: 'city', type: 'STRING' },
        { name: 'count', type: 'INTEGER' },
        { name: 'price', type: 'DECIMAL' },
        { name: 'active', type: 'BOOLEAN' },
      ],
      rows: [
        { city: 'Sao Paulo', count: 10, price: 10.5, active: true },
        { city: 'Recife', count: 20, price: 20.9, active: false },
      ],
    });
  });

  it('reconstructs nested objects from dotted path field names', () => {
    const frame = toDataFrame({
      refId: 'A',
      name: 'Assets',
      fields: [
        { name: 'asset_id', type: FieldType.string, values: ['123'] },
        { name: 'metrics.temperature', type: FieldType.number, values: [23.5] },
        { name: 'sensor_ids.life_signal', type: FieldType.string, values: ['abc'] },
      ],
    });

    expect(frameToLoaderData(frame).rows).toEqual([
      {
        asset_id: '123',
        metrics: {
          temperature: 23.5,
        },
        sensor_ids: {
          life_signal: 'abc',
        },
      },
    ]);
  });

  it('creates stable query identities when multiple frames share the same refId', () => {
    const orders = toDataFrame({
      refId: 'A',
      name: 'Orders',
      fields: [{ name: 'value', type: FieldType.number, values: [1] }],
    });
    const alarms = toDataFrame({
      refId: 'A',
      name: 'Alarms',
      fields: [{ name: 'value', type: FieldType.number, values: [2] }],
    });

    expect(listQueryIdentities([orders, alarms])).toEqual([
      { queryKey: 'A:Orders', refId: 'A', label: 'Orders', frameIndex: 0 },
      { queryKey: 'A:Alarms', refId: 'A', label: 'Alarms', frameIndex: 1 },
    ]);
  });
});

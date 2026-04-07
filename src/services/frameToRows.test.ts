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
        { name: 'active', type: FieldType.boolean, values: [true, false] },
      ],
    });

    expect(frameToLoaderData(frame)).toEqual({
      columns: [
        { name: 'city', type: 'STRING' },
        { name: 'count', type: 'DECIMAL' },
        { name: 'active', type: 'BOOLEAN' },
      ],
      rows: [
        { city: 'Sao Paulo', count: 10, active: true },
        { city: 'Recife', count: 20, active: false },
      ],
    });
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

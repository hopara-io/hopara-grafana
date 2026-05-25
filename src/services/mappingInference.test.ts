import { buildEditorState } from '../components/editors/buildEditorState';
import { buildNextMappings, inferHoparaQueryValue } from './mappingInference';

const queries = [
  { dataSource: 'plants', name: 'Orders', value: 'plants:Orders' },
  { dataSource: 'plants', name: 'Alarms', value: 'plants:Alarms' },
];

const identities = [
  { queryKey: 'A:Orders', refId: 'A', label: 'Orders', frameIndex: 0 },
  { queryKey: 'B:Alerts', refId: 'B', label: 'Alerts', frameIndex: 1 },
];

describe('mappingInference', () => {
  it('infers a Hopara query from the frame label before falling back to empty', () => {
    expect(inferHoparaQueryValue(identities[0], queries)).toBe('plants:Orders');
    expect(inferHoparaQueryValue(identities[1], queries)).toBe('');
  });

  it('preserves manual mappings when rebuilding editor state', () => {
    const mappings = buildNextMappings(identities, queries, [
      {
        queryKey: 'B:Alerts',
        refId: 'B',
        hoparaQueryValue: 'plants:Alarms',
        mappingMode: 'manual',
      },
    ]);

    expect(mappings).toEqual([
      {
        queryKey: 'A:Orders',
        refId: 'A',
        hoparaQueryValue: 'plants:Orders',
        mappingMode: 'inferred',
      },
      {
        queryKey: 'B:Alerts',
        refId: 'B',
        hoparaQueryValue: 'plants:Alarms',
        mappingMode: 'manual',
      },
    ]);

    expect(buildEditorState(identities, queries, mappings)).toEqual([
      {
        queryKey: 'A:Orders',
        refId: 'A',
        label: 'Orders',
        selectedValue: 'plants:Orders',
        mappingMode: 'inferred',
      },
      {
        queryKey: 'B:Alerts',
        refId: 'B',
        label: 'Alerts',
        selectedValue: 'plants:Alarms',
        mappingMode: 'manual',
      },
    ]);
  });
});

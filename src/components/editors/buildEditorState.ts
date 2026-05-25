import { HoparaDatasetQuery, QueryMapping } from '../../types';
import { QueryIdentity } from '../../services/queryIdentity';

export const buildEditorState = (
  identities: QueryIdentity[],
  queries: HoparaDatasetQuery[],
  mappings: QueryMapping[]
) => {
  const validValues = new Set(queries.map((query) => query.value));

  return identities.map((identity) => {
    const current = mappings.find((mapping) => mapping.queryKey === identity.queryKey);
    const selectedValue =
      current && validValues.has(current.hoparaQueryValue) ? current.hoparaQueryValue : '';

    return {
      queryKey: identity.queryKey,
      refId: identity.refId,
      label: identity.label,
      selectedValue,
      mappingMode: current?.mappingMode ?? 'manual',
    };
  });
};

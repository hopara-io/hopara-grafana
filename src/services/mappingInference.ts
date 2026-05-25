import { HoparaDatasetQuery, QueryMapping } from '../types';
import { QueryIdentity } from './queryIdentity';

const normalize = (value: string) => value.toLowerCase().replace(/[\s:_-]+/g, '');

export const inferHoparaQueryValue = (
  identity: QueryIdentity,
  queries: HoparaDatasetQuery[]
): string => {
  const byRefId = queries.find((query) => normalize(query.name) === normalize(identity.refId));

  if (byRefId) {
    return byRefId.value;
  }

  const byLabel = queries.find((query) => normalize(query.name) === normalize(identity.label));

  return byLabel?.value ?? '';
};

export const buildNextMappings = (
  identities: QueryIdentity[],
  queries: HoparaDatasetQuery[],
  currentMappings: QueryMapping[]
): QueryMapping[] => {
  return identities.map((identity) => {
    const existing = currentMappings.find((mapping) => mapping.queryKey === identity.queryKey);

    if (existing?.mappingMode === 'manual') {
      return existing;
    }

    const inferredValue = inferHoparaQueryValue(identity, queries);

    return {
      queryKey: identity.queryKey,
      refId: identity.refId,
      hoparaQueryValue: inferredValue,
      mappingMode: inferredValue ? 'inferred' : 'manual',
    };
  });
};

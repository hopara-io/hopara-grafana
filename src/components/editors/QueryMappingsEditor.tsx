import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Alert, InlineField, Select, Stack } from '@grafana/ui';
import { buildEditorState } from './buildEditorState';
import { fetchDatasetQueries } from '../../services/hoparaApi';
import { buildNextMappings } from '../../services/mappingInference';
import { listQueryIdentities } from '../../services/queryIdentity';
import { HoparaPanelOptions, QueryMapping } from '../../types';

export const QueryMappingsEditor = ({
  value,
  onChange,
  context,
}: StandardEditorProps<QueryMapping[]>) => {
  const options = (context?.options ?? {}) as HoparaPanelOptions;
  const series = context?.data ?? [];
  const [queries, setQueries] = useState<Array<{ label: string; value: string }>>([]);
  const [error, setError] = useState('');

  const identities = useMemo(() => listQueryIdentities(series), [series]);
  const currentMappings = value ?? [];

  // Keep latest values in refs so the effect can read them without being re-triggered
  const onChangeRef = useRef(onChange);
  const currentMappingsRef = useRef(currentMappings);
  const identitiesRef = useRef(identities);
  onChangeRef.current = onChange;
  currentMappingsRef.current = currentMappings;
  identitiesRef.current = identities;

  useEffect(() => {
    const url = options.datasetUrl || 'https://dataset.hopara.app/view';
    setError('');

    fetchDatasetQueries(url, options.accessToken).then((result) => {
      setQueries(result.map((query) => ({ label: `${query.dataSource} > ${query.name}`, value: query.value })));

      if (options.allowInference) {
        const nextMappings = buildNextMappings(identitiesRef.current, result, currentMappingsRef.current);

        if (JSON.stringify(nextMappings) !== JSON.stringify(currentMappingsRef.current)) {
          onChangeRef.current(nextMappings);
        }
      }
    }).catch((reason: Error) => setError(reason.message));
  }, [options.datasetUrl, options.allowInference, options.accessToken]);

  const rows = buildEditorState(
    identities,
    queries.map((query) => {
      const [dataSource, name] = query.value.split(':');
      return { dataSource, name, value: query.value };
    }),
    currentMappings
  );

  return (
    <Stack direction="column" gap={1}>
      {error && <Alert title="Dataset discovery failed" severity="error">{error}</Alert>}
      {rows.map((row) => (
        <InlineField key={row.queryKey} label={row.refId}>
          <Select
            options={queries}
            value={queries.find((query) => query.value === row.selectedValue) ?? null}
            onChange={(item) => {
              const fallbackMappings = buildNextMappings(
                identities,
                queries.map((query) => {
                  const [dataSource, name] = query.value.split(':');
                  return { dataSource, name, value: query.value };
                }),
                currentMappings
              );

              onChange(
                fallbackMappings.map((mapping) =>
                  mapping.queryKey === row.queryKey
                    ? {
                        ...mapping,
                        hoparaQueryValue: item?.value ?? '',
                        mappingMode: 'manual',
                      }
                    : mapping
                )
              );
            }}
          />
        </InlineField>
      ))}
    </Stack>
  );
};

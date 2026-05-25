import React, { useEffect, useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Alert, InlineField, Select, Spinner } from '@grafana/ui';
import { fetchVisualizations } from '../../services/hoparaApi';
import { HoparaPanelOptions } from '../../types';

export const VisualizationSelectEditor = ({
  value,
  onChange,
  context,
}: StandardEditorProps<string>) => {
  const options = (context?.options ?? {}) as HoparaPanelOptions;
  const [items, setItems] = useState<Array<{ label: string; value: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = options.visualizationUrl || 'https://visualization.hopara.app/visualization';
    
    Promise.resolve().then(() => {
      setLoading(true);
      setError('');
    });

    fetchVisualizations(url, options.accessToken)
      .then((result) =>
        setItems(result.map((item) => ({ label: item.name, value: item.id })))
      )
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [options.visualizationUrl, options.accessToken]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert title="Visualization discovery failed" severity="error">{error}</Alert>;
  }

  return (
    <InlineField label="Visualization">
      <Select
        options={items}
        value={items.find((item) => item.value === value) ?? null}
        onChange={(item) => onChange(item?.value ?? '')}
      />
    </InlineField>
  );
};

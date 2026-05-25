import React, { useEffect, useMemo, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { Alert } from '@grafana/ui';
import { frameToLoaderData } from '../services/frameToRows';
import { createHoparaClient, HoparaClient } from '../services/hoparaClient';
import { listQueryIdentities } from '../services/queryIdentity';
import { HoparaPanelOptions } from '../types';

type Props = PanelProps<HoparaPanelOptions>;

export const HoparaPanel: React.FC<Props> = ({ data, options, replaceVariables }) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<HoparaClient | null>(null);

  const resolvedOptions = useMemo(
    () => ({
      ...options,
      embeddedUrl: replaceVariables(options.embeddedUrl),
      accessToken: replaceVariables(options.accessToken),
      tenant: replaceVariables(options.tenant),
      visualizationId: replaceVariables(options.visualizationId),
    }),
    [options, replaceVariables]
  );

  const queryIdentities = useMemo(() => listQueryIdentities(data.series), [data.series]);
  const mappingByKey = useMemo(
    () => new Map((options.mappings ?? []).map((mapping) => [mapping.queryKey, mapping])),
    [options.mappings]
  );

  const missingConfig =
    !resolvedOptions.accessToken ||
    !resolvedOptions.tenant ||
    !resolvedOptions.visualizationId;

  const unmapped = queryIdentities.filter((identity) => {
    const mapping = mappingByKey.get(identity.queryKey);
    return !mapping || !mapping.hoparaQueryValue;
  });

  useEffect(() => {
    if (missingConfig || !hostRef.current || clientRef.current) {
      return;
    }

    clientRef.current = createHoparaClient({
      embeddedUrl: resolvedOptions.embeddedUrl,
      targetElement: hostRef.current,
      debug: resolvedOptions.debug,
      accessToken: resolvedOptions.accessToken,
      tenant: resolvedOptions.tenant,
    });

    return () => {
      clientRef.current = null;

      if (hostRef.current) {
        hostRef.current.replaceChildren();
      }
    };
  }, [missingConfig, resolvedOptions.debug, resolvedOptions.embeddedUrl, resolvedOptions.accessToken, resolvedOptions.tenant]);

  useEffect(() => {
    if (missingConfig || !clientRef.current) {
      return;
    }

    const dataLoaders = queryIdentities
      .map((identity) => {
        const mapping = mappingByKey.get(identity.queryKey);

        if (!mapping?.hoparaQueryValue) {
          return null;
        }

        const [source, query] = mapping.hoparaQueryValue.split(':');
        const frame = data.series[identity.frameIndex];

        return {
          source,
          query,
          name: query,
          loader: async () => {
            const res = frameToLoaderData(frame);
            return res.rows;
          },
          cache: false,
        };
      })
      .filter(Boolean);

    clientRef.current.update({
      visualizationId: resolvedOptions.visualizationId,
      accessToken: resolvedOptions.accessToken,
      tenant: resolvedOptions.tenant,
      dataLoaders: dataLoaders as Array<{
        source: string;
        query: string;
        name?: string;
        loader: () => Promise<Array<Record<string, unknown>>>;
        cache: boolean;
      }>,
    });
    clientRef.current.refresh();
  }, [
    data.series,
    mappingByKey,
    missingConfig,
    queryIdentities,
    resolvedOptions.visualizationId,
    resolvedOptions.accessToken,
    resolvedOptions.tenant,
  ]);

  if (missingConfig) {
    return (
      <Alert title="Configure Hopara Panel" severity="info">
        Set Access Token, Tenant, and Visualization in the panel options.
      </Alert>
    );
  }

  return (
    <>
      {unmapped.length > 0 && (
        <Alert title="Unmapped Grafana queries" severity="warning">
          {unmapped.map((identity) => identity.queryKey).join(', ')}
        </Alert>
      )}
      <div ref={hostRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
};

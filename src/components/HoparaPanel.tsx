import React from 'react';
import { PanelProps } from '@grafana/data';
import { Alert } from '@grafana/ui';
import { HoparaPanelOptions } from '../types';

type Props = PanelProps<HoparaPanelOptions>;

export const HoparaPanel: React.FC<Props> = ({ options }) => {
  const missingConfig =
    !options.embeddedUrl ||
    !options.visualizationUrl ||
    !options.datasetUrl ||
    !options.visualizationId;

  if (missingConfig) {
    return (
      <Alert title="Configure Hopara Panel" severity="info">
        Set embeddedUrl, visualizationUrl, datasetUrl, and visualizationId in the panel options.
      </Alert>
    );
  }

  return <div>Hopara panel bootstrap complete.</div>;
};

import React from 'react';
import { FieldType, PanelProps, toDataFrame } from '@grafana/data';
import { render, screen } from '@testing-library/react';
import { HoparaPanel } from './HoparaPanel';
import { HoparaPanelOptions } from '../types';

const update = jest.fn();
const refresh = jest.fn();

jest.mock('../services/hoparaClient', () => ({
  createHoparaClient: () => ({
    update,
    refresh,
  }),
}));

const frame = toDataFrame({
  refId: 'A',
  name: 'Orders',
  fields: [
    { name: 'city', type: FieldType.string, values: ['Sao Paulo'] },
    { name: 'count', type: FieldType.number, values: [10] },
  ],
});

const options: HoparaPanelOptions = {
  embeddedUrl: 'http://localhost:3000',
  visualizationUrl: 'http://localhost:3001/visualizations',
  datasetUrl: 'http://localhost:3002/datasets',
  visualizationId: 'viz-1',
  mappings: [
    {
      queryKey: 'A:Orders',
      refId: 'A',
      hoparaQueryValue: 'plants:Orders',
      mappingMode: 'manual',
    },
  ],
  allowInference: true,
  debug: false,
};

const props = {
  id: 1,
  data: { series: [frame], state: 'Done' },
  options,
  timeRange: {} as any,
  timeZone: 'browser',
  width: 800,
  height: 400,
  fieldConfig: { defaults: {}, overrides: [] },
  replaceVariables: (value: string) => value,
  transparent: false,
  renderCounter: 0,
  eventBus: {} as any,
  title: 'Hopara',
  onOptionsChange: jest.fn(),
  onChangeTimeRange: jest.fn(),
} as PanelProps<HoparaPanelOptions>;

describe('HoparaPanel', () => {
  it('renders a configuration message when required fields are missing', () => {
    render(<HoparaPanel {...props} options={{ ...options, embeddedUrl: '' }} />);

    expect(screen.getByText(/Configure Hopara Panel/)).toBeInTheDocument();
  });

  it('pushes visualizationId and data loaders to Hopara when configured', () => {
    render(<HoparaPanel {...props} />);

    expect(update).toHaveBeenCalledTimes(1);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(update.mock.calls[0][0].visualizationId).toBe('viz-1');
    expect(update.mock.calls[0][0].dataLoaders).toHaveLength(1);
  });
});

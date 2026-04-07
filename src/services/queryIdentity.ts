import { DataFrame } from '@grafana/data';

export interface QueryIdentity {
  queryKey: string;
  refId: string;
  label: string;
  frameIndex: number;
}

export const listQueryIdentities = (series: DataFrame[]): QueryIdentity[] => {
  return series.map((frame, frameIndex) => {
    const refId = frame.refId ?? `frame-${frameIndex + 1}`;
    const label = frame.name || `${refId} #${frameIndex + 1}`;

    return {
      queryKey: `${refId}:${label}`,
      refId,
      label,
      frameIndex,
    };
  });
};

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
    
    let label = frame.name;
    if (!label) {
      const fieldNames = frame.fields
        .map((f) => f.name)
        .filter(Boolean);
      
      if (fieldNames.length > 0) {
        label = fieldNames.length > 3
          ? `Fields: ${fieldNames.slice(0, 3).join(', ')}...`
          : `Fields: ${fieldNames.join(', ')}`;
      } else {
        label = `Query ${refId}`;
      }
    }

    return {
      queryKey: `${refId}:${label}`,
      refId,
      label,
      frameIndex,
    };
  });
};

import { DataFrame, DataFrameView, FieldType } from '@grafana/data';

type HoparaColumnType = 'STRING' | 'INTEGER' | 'DECIMAL' | 'BOOLEAN' | 'DATETIME';

interface HoparaColumn {
  name: string;
  type: HoparaColumnType;
}

interface HoparaLoaderData {
  columns: HoparaColumn[];
  rows: Array<Record<string, unknown>>;
}

const toHoparaColumnType = (field: any): HoparaColumnType => {
  switch (field.type) {
    case FieldType.boolean:
      return 'BOOLEAN';
    case FieldType.time:
      return 'DATETIME';
    case FieldType.number: {
      const values = field.values;
      if (values && values.length > 0) {
        let allInt = true;
        for (let i = 0; i < values.length; i++) {
          const val = typeof values.get === 'function' ? values.get(i) : values[i];
          if (val !== null && val !== undefined) {
            if (typeof val !== 'number' || !Number.isInteger(val)) {
              allInt = false;
              break;
            }
          }
        }
        if (allInt) {
          return 'INTEGER';
        }
      }
      return 'DECIMAL';
    }
    default:
      return 'STRING';
  }
};

const setNestedValue = (obj: any, path: string, value: any) => {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
};

export const frameToLoaderData = (frame: DataFrame): HoparaLoaderData => {
  const columns = frame.fields.map((field) => ({
    name: field.name,
    type: toHoparaColumnType(field),
  }));

  const view = new DataFrameView(frame);
  const rows: Array<Record<string, unknown>> = [];

  for (const item of view) {
    const row: Record<string, unknown> = {};

    for (const column of columns) {
      let value = item[column.name];

      // Clean and normalize value types for JSON/Hopara transmission
      if (column.type === 'DATETIME' && value !== undefined && value !== null) {
        if (typeof value === 'number') {
          value = new Date(value).toISOString();
        } else if (value instanceof Date) {
          value = value.toISOString();
        }
      } else if (column.type === 'DECIMAL' || column.type === 'INTEGER') {
        if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
          value = null;
        }
      }

      // Expand dotted paths like "metrics.temperature" into nested objects
      if (column.name.includes('.')) {
        setNestedValue(row, column.name, value);
      } else {
        row[column.name] = value;
      }
    }

    rows.push(row);
  }

  return { columns, rows };
};

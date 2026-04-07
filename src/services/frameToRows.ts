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

const toHoparaColumnType = (type: FieldType): HoparaColumnType => {
  switch (type) {
    case FieldType.boolean:
      return 'BOOLEAN';
    case FieldType.time:
      return 'DATETIME';
    case FieldType.number:
      return 'DECIMAL';
    default:
      return 'STRING';
  }
};

export const frameToLoaderData = (frame: DataFrame): HoparaLoaderData => {
  const columns = frame.fields.map((field) => ({
    name: field.name,
    type: toHoparaColumnType(field.type),
  }));

  const view = new DataFrameView(frame);
  const rows: Array<Record<string, unknown>> = [];

  for (const item of view) {
    const row: Record<string, unknown> = {};

    for (const column of columns) {
      row[column.name] = item[column.name];
    }

    rows.push(row);
  }

  return { columns, rows };
};

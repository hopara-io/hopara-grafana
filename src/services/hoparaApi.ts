import { HoparaDatasetQuery, HoparaVisualization } from '../types';

const fetchJson = async <T>(url: string, token?: string): Promise<T> => {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `Hopara request failed for ${url}: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
};

export const toHoparaQueryValue = (query: Pick<HoparaDatasetQuery, 'dataSource' | 'name'>) =>
  `${query.dataSource}:${query.name}`;

export const fetchVisualizations = async (url: string, token?: string): Promise<HoparaVisualization[]> => {
  const payload = await fetchJson<Array<{ id: string; name: string }>>(url, token);

  return payload.map((item) => ({
    id: item.id,
    name: item.name,
  }));
};

export const fetchDatasetQueries = async (url: string, token?: string): Promise<HoparaDatasetQuery[]> => {
  const payload = await fetchJson<Array<{ dataSource: string; name: string }>>(url, token);

  return payload.map((item) => ({
    dataSource: item.dataSource,
    name: item.name,
    value: toHoparaQueryValue(item),
  }));
};

import { test, expect } from '@grafana/plugin-e2e';

test('shows configuration guidance when required Hopara options are missing', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });
  await expect(panelEditPage.panel.locator).toContainText('Configure Hopara Panel');
  await expect(panelEditPage.panel.locator).toContainText(
    'Set embeddedUrl, visualizationUrl, datasetUrl, and visualizationId in the panel options.'
  );
});

test('renders the bootstrap placeholder when Hopara options are provisioned', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  await expect(panelEditPage.panel.locator).toContainText('Hopara panel bootstrap complete.');
});

test('leaves the configuration state after filling the required options', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });
  const connectionOptions = panelEditPage.getCustomOptions('Connection');
  const visualizationOptions = panelEditPage.getCustomOptions('Visualization');

  await connectionOptions.getTextInput('Embedded URL').fill('http://localhost:3000');
  await connectionOptions.getTextInput('Visualization URL').fill('http://localhost:3001/visualizations');
  await connectionOptions.getTextInput('Dataset URL').fill('http://localhost:3002/datasets');
  await visualizationOptions.getTextInput('Visualization ID').fill('viz-2');

  await expect(panelEditPage.panel.locator).toContainText('Hopara panel bootstrap complete.');
});

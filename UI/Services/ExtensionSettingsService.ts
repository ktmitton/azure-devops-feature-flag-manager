import { CommonServiceIds, IExtensionDataService } from 'azure-devops-extension-api';
import { getService, getExtensionContext, getAccessToken } from 'azure-devops-extension-sdk';

const saveSetting = async (projectId: string, key: string, value: string) => {
  const extensionDataService = await getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
  const accessToken = await getAccessToken();
  const extensionContext = getExtensionContext();
  const extensionDataManager = await extensionDataService.getExtensionDataManager(`${extensionContext.publisherId}.${extensionContext.extensionId}`, accessToken);

  await extensionDataManager.setValue(`${projectId}-${key}`, value);
};

const getSetting = async (projectId: string, key: string) => {
  const extensionDataService = await getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
  const accessToken = await getAccessToken();
  const extensionContext = getExtensionContext();
  const extensionDataManager = await extensionDataService.getExtensionDataManager(`${extensionContext.publisherId}.${extensionContext.extensionId}`, accessToken);

  return await extensionDataManager.getValue<string | undefined>(`${projectId}-${key}`);
};

export { saveSetting, getSetting }

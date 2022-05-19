import { CommonServiceIds, IExtensionDataService, IProjectPageService } from 'azure-devops-extension-api';
import { getService, getExtensionContext, getAccessToken, getUser } from 'azure-devops-extension-sdk';
import { getClient } from 'azure-devops-extension-api';
import { GraphRestClient } from 'azure-devops-extension-api/Graph/GraphClient';
import { IIdentity, IPersonaConnections, IPeoplePickerProvider } from "azure-devops-ui/IdentityPicker";
import { IdentityServiceIds, IVssIdentityService } from "azure-devops-extension-api/Identities";

// .then(projectService => projectService.getProject())
// .then(projectInfo => canUpdate && setProject(projectInfo))
const getGroups = async () => {
  const projectService = await getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
  const service = await getService<IVssIdentityService>(IdentityServiceIds.IdentityService);
  const projectInfo = await projectService.getProject();
  if (projectInfo !== undefined) {
    const groups = await service.searchIdentitiesAsync(`[${projectInfo?.name}]\\\\Project Administrators`);
    var user = getUser();
    const groupDescriptor = await getClient(GraphRestClient).getDescriptor(groups[0].originId);
    var subject = await getClient(GraphRestClient).checkMembershipExistence(user.descriptor, groupDescriptor.value);
  }
};

export { getGroups }

import { getClient, CommonServiceIds, IProjectPageService, IProjectInfo, IExtensionDataService, IExtensionDataManager } from 'azure-devops-extension-api';
import { GitRestClient } from 'azure-devops-extension-api/Git/GitClient';
import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { getService, getExtensionContext, getAccessToken } from 'azure-devops-extension-sdk';
import React, { useEffect, useState } from 'react';
import { getSetting } from '../Services/ExtensionSettingsService';

interface RepositoryContextState {
  project?: IProjectInfo;
  repository?: GitRepository;
  needsConfigured: boolean;
}

interface RepositoryContextProps extends RepositoryContextState {
  refresh: () => void;
}

const RepositoryContext = React.createContext<RepositoryContextProps>({
  project: undefined,
  repository: undefined,
  needsConfigured: false,
  refresh: () => { }
});

const getExtensionDataManager = () => getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService)
  .then(extensionDataService => {
    return getAccessToken().then(accessToken => {
      return extensionDataService.getExtensionDataManager(`${getExtensionContext().publisherId}.${getExtensionContext().extensionId}`, accessToken);
    });
  });

const RepositoryContextProvider = ({ children }: { children: React.ReactElement }) => {
  const [project, setProject] = useState<IProjectInfo>();
  const [repository, setRepository] = useState<GitRepository>();
  const [needsConfigured, setNeedsConfigured] = useState(false);

  const loadEffect = () => {
    let canUpdate = true;

    if (project === undefined) {
      getService<IProjectPageService>(CommonServiceIds.ProjectPageService)
        .then(projectService => projectService.getProject())
        .then(projectInfo => canUpdate && setProject(projectInfo))
    } else if (repository === undefined) {
      getSetting(project.id, 'RepositoryId')
        .then(repositoryId => {
          if (repositoryId !== undefined) {
            return getClient(GitRestClient).getRepository(repositoryId, project.id)
              .then(repository => {
                canUpdate && setRepository(repository);
              });
          }

          setNeedsConfigured(true);
        })
    }

    return () => { canUpdate = false; };
  }

  useEffect(() => loadEffect(), [project, repository, needsConfigured]);

  const context = {
    project: project,
    repository: repository,
    needsConfigured: needsConfigured,
    refresh: () => {
      setRepository(undefined);
      setNeedsConfigured(false);
    }
  };

  return (
    <RepositoryContext.Provider value={context}>
      {children}
    </RepositoryContext.Provider>
  );
}

export { RepositoryContextProvider, RepositoryContext };

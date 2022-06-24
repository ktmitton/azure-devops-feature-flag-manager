import { CommonServiceIds, IProjectPageService, IProjectInfo } from 'azure-devops-extension-api';
import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { getService } from 'azure-devops-extension-sdk';
import React, { useEffect, useState } from 'react';
import { getSetting } from '../Services/ExtensionSettingsService';
import { getRepository } from '../Services/GitService';

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
            return getRepository(project.id, repositoryId)
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

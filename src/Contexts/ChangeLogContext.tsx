import { getClient } from 'azure-devops-extension-api';
import { GitRestClient } from 'azure-devops-extension-api/Git/GitClient';
import { GitCommitRef, GitQueryCommitsCriteria, GitVersionOptions, GitVersionType } from 'azure-devops-extension-api/Git/Git';
import React, { useContext, useEffect, useState } from 'react';
import { RepositoryContext } from './RepositoryContext';

interface ChangeLogContextState {
  commitId?: string;
  commitReferences: GitCommitRef[];
  isUpdating: boolean
}

interface ChangeLogContextProps extends ChangeLogContextState {
  refresh: () => void;
}

const ChangeLogContext = React.createContext<ChangeLogContextProps>({
  commitId: undefined,
  commitReferences: [],
  isUpdating: false,
  refresh: () => { }
});

const ChangeLogContextProvider = ({ children }: { children: React.ReactElement }) => {
  const { project, repository } = useContext(RepositoryContext);
  const [commitReferences, setCommitReferences] = useState<GitCommitRef[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [repositoryId, setRepositoryId] = useState(repository?.id);

  const commitId = commitReferences[0]?.commitId;

  const isUpdating = isRefreshing || (repositoryId !== repository?.id);

  const loadEffect = () => {
    let canUpdate = true;

    if ((project !== undefined) && (repository !== undefined) && isUpdating) {
      getClient(GitRestClient).getCommits(
        repository.id, {
          itemPath: '/manifest.json',
          itemVersion: {
            versionOptions: GitVersionOptions.None,
            versionType: GitVersionType.Branch,
            version: 'main'
          }
        } as GitQueryCommitsCriteria,
        project.id)
        .then(commitReferences => {
          if (canUpdate) {
            setRepositoryId(repository.id);
            setCommitReferences(commitReferences);
            setIsRefreshing(false);
          }
        })
        .catch(() => {
          if (canUpdate) {
            setRepositoryId(repository.id);
            setCommitReferences([]);
            setIsRefreshing(false);
          }
        });
    }

    return () => { canUpdate = false; };
  }

  useEffect(() => loadEffect(), [project, repository, isUpdating]);

  return (
    <ChangeLogContext.Provider value={{ commitId: commitId, commitReferences: commitReferences, isUpdating: isUpdating, refresh: () => setIsRefreshing(true) }}>
      {children}
    </ChangeLogContext.Provider>
  );
}

export { ChangeLogContextProvider, ChangeLogContext };

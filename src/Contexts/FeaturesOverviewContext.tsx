import React, { useContext, useEffect, useState } from 'react';
import { RepositoryContext } from './RepositoryContext';
import FeaturesOverview from '../Models/FeaturesOverview';
import { ChangeLogContext } from './ChangeLogContext';
import { readFile, writeFile } from '../Services/GitService';

interface FeaturesOverviewContextState {
  featuresOverview?: FeaturesOverview,
  isLocked: boolean
}

interface FeaturesOverviewContextProps extends FeaturesOverviewContextState {
  save: (comment: string) => void
}

const FeaturesOverviewContext = React.createContext<FeaturesOverviewContextProps>({
  featuresOverview: undefined,
  isLocked: false,
  save: () => { }
});

const FeaturesOverviewContextProvider = ({ children }: { children: React.ReactElement }) => {
  const { project, repository } = useContext(RepositoryContext);
  const { commitId: changeLogCommitId, isUpdating: changeLogIsUpdating, refresh: refreshChangeLog } = useContext(ChangeLogContext);
  const [featuresOverview, setFeaturesOverview] = useState<FeaturesOverview>();
  const [isSaving, setIsSaving] = useState(false);
  const [commitId, setCommitId] = useState(changeLogCommitId);

  const areDependenciesLoaded = (project !== undefined) && (repository !== undefined) && (changeLogCommitId !== undefined);
  const doCommitIdsMatch = (commitId === changeLogCommitId);

  const canSave = areDependenciesLoaded && doCommitIdsMatch && !isSaving;

  const loadEffect = () => {
    let canUpdate = true;

    if (areDependenciesLoaded && !doCommitIdsMatch) {
      readFile(project.id, repository.id, '/manifest.json', changeLogCommitId)
        .then(contents => {
          setFeaturesOverview(JSON.parse(contents) as FeaturesOverview);
          setCommitId(changeLogCommitId);
          setIsSaving(false);
        });
    } else if (!areDependenciesLoaded) {
      setFeaturesOverview(undefined);
    }

    return () => { canUpdate = false; };
  };

  const save = (comment: string) => {
    if (canSave) {
      setIsSaving(true);

      writeFile(project.id, repository.id, repository.defaultBranch, '/manifest.json', comment, JSON.stringify(featuresOverview, null, 2), commitId)
        .then(() => {
          refreshChangeLog();
        })
        .catch((e) => {
          console.debug(e);
          alert('Unable to commit changes, somebody else may have already updated settings, refresh the page and try again.')
        });
    }
  };

  useEffect(() => loadEffect(), [areDependenciesLoaded, doCommitIdsMatch, changeLogCommitId]);

  return (
    <FeaturesOverviewContext.Provider value={{ featuresOverview: featuresOverview, isLocked: !canSave, save: save }}>
      {children}
    </FeaturesOverviewContext.Provider>
  );
}

export { FeaturesOverviewContextProvider, FeaturesOverviewContext };

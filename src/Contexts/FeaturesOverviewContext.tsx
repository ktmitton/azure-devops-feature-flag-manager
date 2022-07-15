import React, { useContext, useEffect, useState } from 'react';
import { RepositoryContext } from './RepositoryContext';
import { ChangeLogContext } from './ChangeLogContext';
import { readFile, writeFile } from '../Services/GitService';
import Manifest, { convertFromV1 } from '../Models/Manifest/V2/Manifest';
import FeaturesOverview from '../Models/Manifest/V1/FeaturesOverview';

interface FeaturesOverviewContextState {
  featuresOverview?: Manifest,
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
  const [featuresOverview, setFeaturesOverview] = useState<Manifest>();
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
          const { version } = JSON.parse(contents);

          switch (version) {
            case '1.0':
              const newVersion = convertFromV1(JSON.parse(contents) as FeaturesOverview);
              setFeaturesOverview(newVersion);
              // Convert to 2.0
              break;
            case '2.0':
              setFeaturesOverview(JSON.parse(contents) as Manifest);
              // Load 2.0
              break;
            default:
              throw new Error(`Unknown version ${version}`);
          }
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

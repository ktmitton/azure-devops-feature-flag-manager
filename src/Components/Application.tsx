import React, { useContext, useEffect, useState } from 'react';
import { FeatureGroup } from './FeatureGroup';
import { EnvironmentSelector } from './EnvironmentSelector';
import { SplitterElementPosition, Splitter, SplitterDirection } from "azure-devops-ui/Splitter";
import { ChangeLog } from './ChangeLog';
import { FeaturesOverviewContext } from '../Contexts/FeaturesOverviewContext';
import { Initializer } from './Initializer';
import { Page } from 'azure-devops-ui/Page';
import {
  Header,
  TitleSize
} from "azure-devops-ui/Header";
import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { RepositoryContext } from '../Contexts/RepositoryContext';
import { saveSetting } from '../Services/ExtensionSettingsService';
import { RepositorySelectionDialog } from './RepositorySelectionDialog';

const Application = () => {
  const { featuresOverview } = useContext(FeaturesOverviewContext);
  const { project, repository, refresh } = useContext(RepositoryContext);
  const [showRepositorySelectionDialog, setShowRepositorySelectionDialog] = useState(false);
  const [needsInitialized, setNeedsInitialized] = useState(true);

  const needsInitializedEffect = () => {
    if (!needsInitialized && (project === undefined || repository === undefined)) {
      setNeedsInitialized(true);
    } else if (needsInitialized && featuresOverview !== undefined) {
      setNeedsInitialized(false);
    }
  }

  useEffect(() => needsInitializedEffect(), [needsInitialized, project, repository, featuresOverview]);

  if (needsInitialized) {
    return <Initializer />
  }

  const onRepositorySelected = async (selectedRepository?: GitRepository) => {
    if (project !== undefined && selectedRepository !== undefined) {
      await saveSetting(project.id, 'RepositoryId', selectedRepository.id);
      refresh();
    }

    setShowRepositorySelectionDialog(false);
  };

  return (
    <Page>
      {showRepositorySelectionDialog && <RepositorySelectionDialog onDismiss={onRepositorySelected} />}
      <Header
        title={'Feature Flags'}
        titleSize={TitleSize.Large}
        commandBarItems={[
          {
            id: 'changeRepository',
            important: false,
            onActivate: () => setShowRepositorySelectionDialog(true),
            text: 'Change Repository'
          }
        ]}
      />
      <Splitter
        fixedElement={SplitterElementPosition.Near}
        splitterDirection={SplitterDirection.Vertical}
        onRenderNearElement={() => <Page className="rhythm-vertical-16"><EnvironmentSelector />{featuresOverview?.featureGroups.map(x => <FeatureGroup {...x} />)}</Page>}
        onRenderFarElement={() => <Page className="rhythm-vertical-16"><ChangeLog /></Page>}
      />
    </Page>
  );
}

export { Application }

import React, { useContext } from 'react';
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { FeaturesOverviewContext } from '../Contexts/FeaturesOverviewContext';
import { EnvironmentContext } from '../Contexts/EnvironmentContext';

const EnvironmentSelector = () => {
  const { featuresOverview } = useContext(FeaturesOverviewContext);
  const { selectedEnvironment, setSelectedEnvironmentByName } = useContext(EnvironmentContext);

  return (
    <TabBar
      onSelectedTabChanged={(environmentName) => { setSelectedEnvironmentByName(environmentName) }}
      selectedTabId={selectedEnvironment?.name}
      tabSize={TabSize.Tall}
    >
      {featuresOverview?.environments.map(x => <Tab name={x.name} id={x.name} />)}
    </TabBar>
  )
}

export { EnvironmentSelector }

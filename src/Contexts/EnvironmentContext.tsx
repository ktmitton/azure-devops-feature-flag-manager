import React, { useContext, useState } from 'react';
import Environment from '../Models/Manifest/V1/Environment';
import { FeaturesOverviewContext } from './FeaturesOverviewContext';

interface EnvironmentContextState {
  selectedEnvironment?: Environment;
}

interface EnvironmentContextProps extends EnvironmentContextState {
  setSelectedEnvironmentByName: (environmentName: string) => void;
}

const EnvironmentContext = React.createContext<EnvironmentContextProps>({
  selectedEnvironment: undefined,
  setSelectedEnvironmentByName: () => { }
});

const EnvironmentContextProvider = ({ children }: { children: React.ReactElement }) => {
  const { featuresOverview } = useContext(FeaturesOverviewContext);
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>();

  const contextProps: EnvironmentContextProps = {
    selectedEnvironment: featuresOverview?.environments?.find(x => x.name === selectedEnvironment?.name) || featuresOverview?.environments[0],
    setSelectedEnvironmentByName: (environmentName: string) => {
      setSelectedEnvironment(featuresOverview?.environments?.find(x => x.name === environmentName))
    }
  }

  return (
    <EnvironmentContext.Provider value={contextProps}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export { EnvironmentContextProvider, EnvironmentContext };

import React from 'react';
import { init } from 'azure-devops-extension-sdk';
import ReactDOM from 'react-dom';
import { RepositoryContextProvider } from './Contexts/RepositoryContext';
import { ChangeLogContextProvider } from './Contexts/ChangeLogContext';
import { FeaturesOverviewContextProvider } from './Contexts/FeaturesOverviewContext';
import { EnvironmentContextProvider } from './Contexts/EnvironmentContext';
import { Application } from './Components/Application';
import { getGroups } from './Services/SecurityService';

init().then(() => {
  getGroups();
  ReactDOM.render(
    <RepositoryContextProvider>
      <ChangeLogContextProvider>
        <FeaturesOverviewContextProvider>
          <EnvironmentContextProvider>
            <Application />
          </EnvironmentContextProvider>
        </FeaturesOverviewContextProvider>
      </ChangeLogContextProvider>
    </RepositoryContextProvider>
    , document.body);
});

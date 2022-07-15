import React, { useState } from 'react';

import { Card } from "azure-devops-ui/Card";
import { Feature } from './Feature';
import FeatureGroup from '../Models/Manifest/V2/FeatureGroup';
// import { EnvironmentContext } from '../Contexts/EnvironmentContext';

const FeatureGroup = ({ name, description, features, values }: FeatureGroup) => {
  //const { selectedEnvironment } = useContext(EnvironmentContext);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Card
      className='flex-grow'
      collapsible={true}
      collapsed={collapsed}
      onCollapseClick={() => setCollapsed(!collapsed)}
      titleProps={{ text: name }}
      headerDescriptionProps={{ text: description }}
    >
      <div className='flex-grow'>
        {features.map(x => {
          var selectedValue
          return (
            <div className="flex-row" style={{ marginTop: '10px', marginBottom: '10px' }}>
              <Feature feature={x} values={values} />
            </div>
          );
        }
        )}
      </div>
    </Card>
  )
}

export { FeatureGroup }
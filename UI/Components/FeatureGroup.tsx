import React, { useState } from 'react';

import { Card } from "azure-devops-ui/Card";
import { Feature } from './Feature';
import FeatureGroupProps from '../Models/FeatureGroupProps';

const FeatureGroup = ({ name, description, features }: FeatureGroupProps) => {
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
        {features.map(x => <div className="flex-row" style={{ marginTop: '10px', marginBottom: '10px' }}><Feature {...x} /></div>)}
      </div>
    </Card>
  )
}

export { FeatureGroup }
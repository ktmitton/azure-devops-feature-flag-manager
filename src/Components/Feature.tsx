import React, { useContext, useState } from 'react';

import { Dropdown } from 'azure-devops-ui/Dropdown';
import { Toggle } from 'azure-devops-ui/Toggle';
import FeatureProps from '../Models/FeatureProps';
import { ListSelection } from 'azure-devops-ui/List';
import { EnvironmentContext } from '../Contexts/EnvironmentContext';
import { FeaturesOverviewContext } from '../Contexts/FeaturesOverviewContext';

const ToggleFeature = ({ name, options, values }: FeatureProps) => {
  const { save, isLocked } = useContext(FeaturesOverviewContext);
  const { selectedEnvironment } = useContext(EnvironmentContext);

  const selectedOption = values.find(x => x.environmentName === selectedEnvironment?.name);

  const checked = selectedOption?.optionId === 'on';

  const updateValue = (isChecked: boolean) => {
    const matchingOptions = options.find(x => x.id === (isChecked ? 'on' : 'off'));

    if (selectedOption && matchingOptions) {
      const previousOptionId = selectedOption.optionId;

      selectedOption.optionId = matchingOptions.id;

      save(`Updated ${name} in ${selectedEnvironment?.name} from ${previousOptionId} to ${matchingOptions.id}`)
    }
  };

  return (
    <Toggle
      text={name}
      checked={checked}
      onChange={(e, i) => { updateValue(i) }}
      disabled={isLocked}
    />
  );
}

const DialogFeature = ({ name, options, values }: FeatureProps) => {
  const { save, isLocked } = useContext(FeaturesOverviewContext);
  const { selectedEnvironment } = useContext(EnvironmentContext);
  const [listSelection] = useState(new ListSelection());

  const selectedOption = values.find(x => x.environmentName === selectedEnvironment?.name);

  listSelection.select(options.findIndex(x => x.id === selectedOption?.optionId));

  const updateValue = (optionId: string) => {
    if (selectedOption) {
      const previousOptionId = selectedOption.optionId;

      selectedOption.optionId = optionId;

      save(`Updated ${name} in ${selectedEnvironment?.name} from ${previousOptionId} to ${optionId}`)
    }
  };

  return (
    <Dropdown
      items={options.map(x => { return { id: x.id, text: x.name, tooltipProps: { text: x.description } }; })}
      onSelect={(e, i) => { updateValue(i.id) }}
      selection={listSelection}
      dismissOnSelect={true}
      disabled={isLocked}
    />
  );
};

const Feature = (props: FeatureProps) => {
  switch (props.type) {
    case 'toggle':
      return <ToggleFeature {...props} />;
    case 'dropdown':
      return <DialogFeature {...props} />;
    default:
      return <></>
  }
}

export { Feature }

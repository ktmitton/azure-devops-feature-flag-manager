import React, { useContext, useState } from 'react';

import { Dropdown } from 'azure-devops-ui/Dropdown';
import { Toggle } from 'azure-devops-ui/Toggle';
import { ListSelection } from 'azure-devops-ui/List';
import { EnvironmentContext } from '../Contexts/EnvironmentContext';
import { FeaturesOverviewContext } from '../Contexts/FeaturesOverviewContext';
import FeatureProps from '../Models/Manifest/V1/FeatureProps';
import FeatureV2 from '../Models/Manifest/V2/Feature';
import Option from '../Models/Manifest/V2/Option';

interface ToggleFeatureProps {
  name: string;
  options: Option[];
  value: string;
}

const ToggleFeature = ({ name, options, value }: ToggleFeatureProps) => {
  const { save, isLocked } = useContext(FeaturesOverviewContext);
  const [selectedValue, setSelectedValue] = useState(value);

  const checked = selectedValue === 'on';

  const updateValue = (isChecked: boolean) => {
    setSelectedValue(isChecked ? 'on' : 'off');
    // const matchingOptions = options.find(x => x.id === (isChecked ? 'on' : 'off'));

    // if (selectedOption && matchingOptions) {
    //   const previousOptionId = selectedOption.optionId;

    //   selectedOption.optionId = matchingOptions.id;

    //   save(`Updated ${name} in ${selectedEnvironment?.name} from ${previousOptionId} to ${matchingOptions.id}`)
    // }
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

const Feature = (props: FeatureV2) => {
  switch (props.type) {
    case 'toggle':
      return <ToggleFeature name={props.name} options={props.options} value={props.} />;
    case 'dropdown':
      return <DialogFeature {...props} />;
    default:
      return <></>
  }
}

export { Feature }

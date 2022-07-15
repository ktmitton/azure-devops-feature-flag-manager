import Feature, { convertFromV1 as convertFeatureFromV1 } from "./Feature";
import FeatureGroupV1 from "../V1/FeatureGroupProps";

interface FeatureGroup {
  name: string;
  description: string;
  features: Feature[];
  values: { [key: string]: { [key: string]: string } };
  metadata: { [key: string]: string };
}

const convertFromV1 = (original: FeatureGroupV1) => {
  const values = {} as { [key: string]: { [key: string]: string } };

  original.features.forEach((feature) => {
    feature.values.forEach((value) => {
      values[value.environmentName] = values[value.environmentName] || {};
      values[value.environmentName][feature.id] = value.optionId;
    });
  });

  return {
    name: original.name,
    description: original.description,
    features: original.features.map(x => convertFeatureFromV1(x)),
    values: values,
    metadata: original.metadata
  } as FeatureGroup;
}

export default FeatureGroup;

export { convertFromV1 }

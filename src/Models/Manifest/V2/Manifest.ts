import Environment from "./Environment";
import FeatureGroup, { convertFromV1 as convertFeatureGroupFromV1 } from "./FeatureGroup";
import ManifestV1 from "../V1/FeaturesOverview";

interface Manifest {
  version: string;
  environments: Environment[];
  featureGroups: FeatureGroup[];
  metadata: { [key: string]: string };
}

const convertFromV1 = (original: ManifestV1) => {
  return {
    version: '2.0',
    environments: original.environments,
    featureGroups: original.featureGroups.map(group => convertFeatureGroupFromV1(group)),
    metadata: original.metadata
  } as Manifest;
};

export default Manifest;

export { convertFromV1 }

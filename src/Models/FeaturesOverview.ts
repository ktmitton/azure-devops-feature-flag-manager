import Environment from "./Environment";
import FeatureGroupProps from "./FeatureGroupProps";

interface FeaturesOverview {
  environments: Environment[];
  featureGroups: FeatureGroupProps[];
  metadata: { [key: string]: string };
}

export default FeaturesOverview;

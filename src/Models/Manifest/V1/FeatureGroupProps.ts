import FeatureProps from "./FeatureProps";

interface FeatureGroupProps {
  name: string;
  description: string;
  features: FeatureProps[];
  metadata: { [key: string]: string };
}

export default FeatureGroupProps;

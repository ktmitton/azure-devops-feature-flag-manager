import FeatureValue from "./FeatureValue";
import Option from "./Option";

interface FeatureProps {
  name: string;
  description?: string;
  type: string;
  id: string;
  options: Option[];
  values: FeatureValue[];
  metadata: { [key: string]: string };
}

export default FeatureProps;

interface FeatureValue {
  environmentName: string;
  optionId: string;
  metadata: { [key: string]: string };
}

export default FeatureValue;

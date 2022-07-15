import Option, { convertFromV1 as convertOptionFromV1 } from "./Option";
import FeatureV1 from "../V1/FeatureProps";

interface Feature {
  name: string;
  description?: string;
  type: string;
  id: string;
  options: Option[];
  metadata: { [key: string]: string };
}

const convertFromV1 = (original: FeatureV1) => {
  return {
    name: original.name,
    description: original.description,
    type: original.type,
    id: original.id,
    options: original.options.map(x => convertOptionFromV1(x)),
    metadata: original.metadata
  } as Feature;
};

export default Feature;

export { convertFromV1 }

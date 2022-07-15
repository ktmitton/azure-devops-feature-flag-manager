import OptionV1 from "../V1/Option";

interface Option {
  id: string;
  name: string;
  description?: string;
  value: string;
  metadata: { [key: string]: string };
}

const convertFromV1 = (original: OptionV1) => {
  return {
    id: original.id,
    name: original.name,
    description: original.description,
    value: original.value,
    metadata: original.metadata
  };
};

export default Option;

export { convertFromV1 }

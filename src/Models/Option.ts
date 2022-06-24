interface Option {
  id: string;
  name: string;
  description?: string;
  value: string;
  metadata: { [key: string]: string };
}

export default Option;

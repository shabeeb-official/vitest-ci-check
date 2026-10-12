interface AdditionalDescription {
  id: string;
  title: string;
  as: string;
  listItems: string[];
  links?: {
    text: string;
    href: string;
  }[];
}

export default AdditionalDescription;

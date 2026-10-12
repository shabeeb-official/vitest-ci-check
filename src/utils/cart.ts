const cartUtils = {
  getURI: (uriMap: object, countryCode: string) => {
    return uriMap[countryCode] || "";
  },

  getRoddAndGunnURIS: () => {
    return {
      en_AU:
        "https://www.roddandgunn.com/on/demandware.store/Sites-rodd-au-Site/en_AU/Cart-AddProduct?format=ajax",
      en_NZ:
        "https://www.roddandgunn.com/on/demandware.store/Sites-rodd-nz-Site/en_NZ/Cart-AddProduct?format=ajax",
      en_US:
        "https://www.roddandgunn.com/on/demandware.store/Sites-rodd-us-Site/en_US/Cart-AddProduct?format=ajax",
      en_UK:
        "https://www.roddandgunn.com/on/demandware.store/Sites-rodd-uk-Site/en_UK/Cart-AddProduct?format=ajax",
      en_CA:
        "https://www.roddandgunn.com/on/demandware.store/Sites-rodd-ca-Site/en_CA/Cart-AddProduct?format=ajax",
      fr_CA:
        "https://www.roddandgunn.com/on/demandware.store/Sites-rodd-ca-Site/fr_CA/Cart-AddProduct?format=ajax",
      eu: "https://www.roddandgunn.com/on/demandware.store/Sites-rodd-eu-Site/en/Cart-AddProduct?format=ajax",
      fr_FR:
        "https://www.roddandgunn.com/on/demandware.store/Sites-rodd-eu-Site/fr_FR/Cart-AddProduct?format=ajax",
      de_DE:
        "https://www.roddandgunn.com/on/demandware.store/Sites-rodd-eu-Site/de_DE/Cart-AddProduct?format=ajax",
    };
  },
};

export default cartUtils;

export interface Location {
  name: {
    ar: string;
    en: string;
  };
  price: string;
  subLocations: Location[];
}

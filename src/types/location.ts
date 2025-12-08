export interface Location {
  name: {
    ar: string;
    en: string;
  };
  price: string;
  subLocations: Location[];
  __v?: number;
  _id: string;
}

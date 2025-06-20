type Name = {
  ar: string;
  en: string;
};

type Actor = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export interface Category {
  _id: string;
  __v: number;
  name: Name;
  image: string;
  isActive: boolean;
  isDeleted: boolean;
  unDeletedBy: null | Actor;
  createdBy: null | Actor;
  createdAt: Date;
  updatedAt: null | Date;
  deletedAt: null | Date;
  unDeletedAt: null | Date;
}

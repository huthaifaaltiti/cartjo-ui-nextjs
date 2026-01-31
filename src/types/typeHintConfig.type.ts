import { Actor, TranslatedText } from "./common";

export interface TypeHintConfig {
  _id: string;
  key: string;
  label: TranslatedText;
  icon: string;
  colorFrom: string;
  colorTo: string;
  textColor: string;
  priority: number;
  startDate: Date | null;
  endDate: Date | null;
  isSystem: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  unDeletedAt: Date | null;
  updatedAt: Date | null;
  deletedBy: null | Actor;
  unDeletedBy: null | Actor;
  createdBy: null | Actor;
  updatedBy: null | Actor;
  createdAt: Date;
}

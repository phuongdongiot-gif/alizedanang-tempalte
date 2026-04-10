import { viDict } from './vi';
import { enDict } from './en';
import { Dictionary } from '../types';

const dictionaries: Record<string, Dictionary> = {
  vi: viDict,
  en: enDict,
};

export const getDictionary = (locale: string): Dictionary => {
  return dictionaries[locale] || dictionaries['vi'];
};

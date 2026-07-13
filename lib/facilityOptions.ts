import type { SpotCategory } from './database.types';

export const WHEELCHAIR_TAG = 'wheelchair';
export const MULTIPURPOSE_TOILET_TAG = 'multipurpose_toilet';
export const ELEVATOR_TAG = 'elevator';

export const CATEGORY_OPTIONS: { value: SpotCategory; label: string }[] = [
  { value: 'toilet', label: 'トイレ' },
  { value: 'ramp', label: 'スロープ' },
  { value: 'elevator', label: 'エレベーター' },
  { value: 'parking', label: '駐車場' },
  { value: 'entrance', label: '入口' },
  { value: 'other', label: 'その他' },
];

export const ACCESSIBILITY_FEATURE_OPTIONS: { tag: string; label: string }[] = [
  { tag: WHEELCHAIR_TAG, label: '車椅子対応' },
  { tag: MULTIPURPOSE_TOILET_TAG, label: '多目的トイレ' },
  { tag: ELEVATOR_TAG, label: 'エレベーター' },
];

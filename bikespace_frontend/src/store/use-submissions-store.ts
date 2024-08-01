import {createWithEqualityFn} from 'zustand/traditional';
import {shallow} from 'zustand/shallow';

import {
  FiltersSlice,
  createFiltersSlice,
  FocusedIdSlice,
  createFocusedIdSlice,
  SubmissionsSlice,
  createSubmissionsSlice,
  TabSlice,
  createTabSlice,
} from './slices';

type StoreSlice = FiltersSlice & FocusedIdSlice & SubmissionsSlice & TabSlice;

// Combine modular stores (slices) into single global store
export const useSubmissionsStore = createWithEqualityFn<StoreSlice>()(
  (...a) => ({
    ...createFiltersSlice(...a),
    ...createFocusedIdSlice(...a),
    ...createSubmissionsSlice(...a),
    ...createTabSlice(...a),
  }),
  shallow
);

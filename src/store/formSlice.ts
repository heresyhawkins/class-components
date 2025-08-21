import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  acceptTerms: boolean;
  photo: string;
  country: string;
}

export interface FormState {
  entries: FormData[];
  countries: string[];
}

const initialState: FormState = {
  entries: [],
  countries: [
    'United States',
    'Canada',
    'Germany',
    'France',
    'Japan',
    'Brazil',
    'Australia',
    'India',
    'South Africa',
    'Mexico',
  ],
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<FormData>) => {
      state.entries.unshift(action.payload);
    },
    setCountries: (state, action: PayloadAction<string[]>) => {
      state.countries = action.payload;
    },
  },
});

export const { addEntry, setCountries } = formSlice.actions;
export default formSlice.reducer;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Pokemon } from '../types/PokemonTypes';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  tagTypes: ['PokemonList', 'Pokemon'],
  endpoints: (builder) => ({
    getPokemonList: builder.query<
      {
        results: { name: string; url: string }[];
        count: number;
      },
      { offset: number; limit: number }
    >({
      query: ({ offset, limit }) => `pokemon?offset=${offset}&limit=${limit}`,
      providesTags: ['PokemonList'],
    }),

    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name.toLowerCase()}`,
      providesTags: (_result, _error, name) => [{ type: 'Pokemon', name }],
    }),
  }),
});

export const { useGetPokemonListQuery, useGetPokemonByNameQuery, useLazyGetPokemonByNameQuery } =
  pokemonApi;

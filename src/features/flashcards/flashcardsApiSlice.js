import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const flashcardsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    if (a.topicName < b.topicName) {
      return -1;
    } else if (a.topicName > b.topicName) {
      return 1;
    } else {
      return 0
    }
  },
});

const initialState = flashcardsAdapter.getInitialState();

export const flashcardsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFlashcards: builder.query({
      query: () => ({
        url: "/flashcards",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedFlashcards = responseData.map((flashcard) => {
          flashcard.id = flashcard._id;
          return flashcard;
        });
        return flashcardsAdapter.setAll(initialState, loadedFlashcards);
      },
      providedTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Flashcard", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Flashcard", id })),
          ];
        } else return [{ type: "Flashcard", id: "LIST" }];
      },
    }),
    addNewFlashcard: builder.mutation({
      query: (initialFlashcard) => ({
        url: "/flashcards",
        method: "POST",
        body: {
          ...initialFlashcard,
        },
      }),
      invalidatesTags: [{ type: "Flashcard", id: "LIST" }],
    }),
    generateFlashcard: builder.mutation({
      query: (initialFlashcard) => ({
        url: "/flashcards/generate",
        method: "POST",
        body: {
          ...initialFlashcard,
        },
      }),
    }),
    updateFlashcard: builder.mutation({
      query: (initialFlashcard) => ({
        url: "/flashcards",
        method: "PATCH",
        body: {
          ...initialFlashcard,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Flashcard", id: arg.id },
      ],
    }),
    deleteFlashcard: builder.mutation({
      query: ({ id }) => ({
        url: "/flashcards",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Flashcard", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetFlashcardsQuery,
  useAddNewFlashcardMutation,
  useGenerateFlashcardMutation,
  useUpdateFlashcardMutation,
  useDeleteFlashcardMutation,
} = flashcardsApiSlice;

export const selectFlashcardsResult =
  flashcardsApiSlice.endpoints.getFlashcards.select();

const selectFlashcardsData = createSelector(
  selectFlashcardsResult,
  (flashcardsResult) => flashcardsResult.data
);

export const {
  selectAll: selectAllFlashcards,
  selectById: selectFlashcardById,
  selectIds: selectFlashcardIds,
} = flashcardsAdapter.getSelectors(
  (state) => selectFlashcardsData(state) ?? initialState
);

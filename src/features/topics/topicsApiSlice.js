import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const topicsAdapter = createEntityAdapter({});

const initialState = topicsAdapter.getInitialState();

export const topicsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query({
      query: () => ({
        url: "/topics",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedTopics = responseData.map((topic) => {
          topic.id = topic._id;
          return topic;
        });
        return topicsAdapter.setAll(initialState, loadedTopics);
      },
      providedTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Topic", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Topic", id })),
          ];
        } else return [{ type: "Topic", id: "LIST" }];
      },
    }),
    addNewTopic: builder.mutation({
      query: (initialTopic) => ({
        url: "/topics",
        method: "POST",
        body: {
          ...initialTopic,
        },
      }),
      invalidatesTags: [{ type: "Topic", id: "LIST" }],
    }),
    updateTopic: builder.mutation({
      query: (initialTopic) => ({
        url: "/topics",
        method: "PATCH",
        body: {
          ...initialTopic,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Topic", id: arg.id }],
    }),
    deleteTopic: builder.mutation({
      query: ({ id }) => ({
        url: "/topics",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Topic", id: arg.id }],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useAddNewTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = topicsApiSlice;

export const selectTopicsResult = topicsApiSlice.endpoints.getTopics.select();

const selectTopicsData = createSelector(
  selectTopicsResult,
  (topicsResult) => topicsResult.data
);

export const {
  selectAll: selectAllTopics,
  selectById: selectTopicById,
  selectIds: selectTopicIds,
} = topicsAdapter.getSelectors(
  (state) => selectTopicsData(state) ?? initialState
);

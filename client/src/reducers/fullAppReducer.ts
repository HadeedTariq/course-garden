import { PlaylistData, PublishedCourse } from "@/routes/app/types/app";
import { User } from "@/types/general";
import { createSlice } from "@reduxjs/toolkit";

type Theme = "dark" | "light" | "system";

export type FullAppState = {
  theme: Theme;
  storageKey: string;
  user: User | null;
  courses: PublishedCourse[];
  paidChapters: PublishedCourse["courseChapters"] | null;
  playlists: PlaylistData[];
};

const initialState: FullAppState = {
  theme: (localStorage.getItem("vite-ui-theme") as Theme) || "system",
  storageKey: "vite-ui-theme",
  user: null,
  courses: [],
  paidChapters: null,
  playlists: [],
};

const fullAppReducer = createSlice({
  name: "fullAppReducer",
  initialState,
  reducers: {
    setTheme: (state, { payload }: { payload: Theme }) => {
      localStorage.setItem(state.storageKey, payload);
      state.theme = payload;
    },
    setUser: (state, { payload }: { payload: User }) => {
      state.user = payload;
    },
    setCourses: (state, { payload }: { payload: PublishedCourse[] }) => {
      state.courses = payload;
    },
    setPaidChapters: (
      state,
      { payload }: { payload: PublishedCourse["courseChapters"] }
    ) => {
      state.paidChapters = payload;
    },
    setPlaylists: (state, { payload }: { payload: PlaylistData[] }) => {
      state.playlists = payload;
    },
  },
});

export const { setTheme, setUser, setCourses, setPaidChapters, setPlaylists } =
  fullAppReducer.actions;
export default fullAppReducer.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { PublishedCourse } from "../../types/app";

export type TeacherCourses = Omit<PublishedCourse, "teacher"> & {
  teacher: string;
};

export type TeacherState = {
  courses: TeacherCourses[];
};

const initialState: TeacherState = {
  courses: [],
};

const teacherReducer = createSlice({
  name: "teacherReducer",
  initialState,
  reducers: {
    setTeacherCourses: (state, { payload }: { payload: TeacherCourses[] }) => {
      state.courses = payload;
    },
  },
});

export default teacherReducer.reducer;

export const { setTeacherCourses } = teacherReducer.actions;

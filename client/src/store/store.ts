import fullAppReducer, { FullAppState } from "@/reducers/fullAppReducer";
import teacherReducer, {
  TeacherState,
} from "@/routes/app/teacher/reducer/teacherReducer";
import { configureStore } from "@reduxjs/toolkit";

export interface StoreState {
  fullAppReducer: FullAppState;
  teacherReducer: TeacherState;
}

export const store = configureStore({
  reducer: {
    fullAppReducer,
    teacherReducer,
  },
});

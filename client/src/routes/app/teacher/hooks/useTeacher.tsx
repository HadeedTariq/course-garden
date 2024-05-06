import { StoreState } from "@/store/store";
import { useSelector } from "react-redux";

export const useTeacher = () => {
  const teacherState = useSelector((state: StoreState) => state.teacherReducer);

  return { ...teacherState };
};

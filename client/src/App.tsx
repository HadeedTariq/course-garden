import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import RegisterUser from "./routes/auth/pages/RegisterUser";
import LoginUser from "./routes/auth/pages/LoginUser";
import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "./lib/axios";
import { useDispatch } from "react-redux";
import { setUser } from "./reducers/fullAppReducer";
import LoadingBar from "./components/LoadingBar";
import { useFullApp } from "./hooks/useFullApp";
import AuthProtector from "./routes/auth/components/AuthProtector";
import { CreateCourse } from "./routes/app/teacher/pages/CreateCourse";
import PublishCourse from "./routes/app/teacher/pages/PublishCourse";
import Home from "./routes/app/pages/Home";
import WatchCourse from "./routes/app/pages/WatchCourse";
import FreeChapterHeader from "./routes/app/components/FreeChapterHeader";
import FreeChapterContent from "./routes/app/pages/FreeChapterContent";
import PaidChapterHeader from "./routes/app/paidCourse/components/PaidChapterHeader";
import WatchPaidCourse from "./routes/app/paidCourse/pages/WatchPaidCourse";
import PaidChapterContent from "./routes/app/paidCourse/pages/PaidChapterContent";
import PurchaseCourse from "./routes/app/pages/PurchaseCourse";
import PaymentSuccessFull from "./routes/app/paidCourse/pages/PaymentSuccessFull";
import TeacherDashboardSidebar from "./routes/app/teacher/components/TeacherDashboardSidebar";
import DashboardHome from "./routes/app/teacher/components/DashboardHome";
import TeacherCourses from "./routes/app/teacher/pages/TeacherCourses";
import TeacherStats from "./routes/app/teacher/pages/TeacherStats";
import TeacherCourseDetails from "./routes/app/teacher/pages/TeacherCourseDetails";
import StudentDashboardSidebar from "./routes/app/student/components/StudentDashboardSidebar";
import StudentDashboardHome from "./routes/app/student/pages/StudentDashboardHome";
import StudentEnrolledCourses from "./routes/app/student/pages/StudentEnrolledCourses";
import StudentPlaylists from "./routes/app/student/pages/StudentPlaylists";
import WatchPlaylist from "./routes/app/student/pages/WatchPlaylist";
import AdminPanel from "./routes/app/admin/components/AdminPanel";
import AdminHome from "./routes/app/admin/pages/AdminHome";
import AdminNotification from "./routes/app/admin/pages/AdminNotification";

function App() {
  const { theme } = useTheme();
  const { user } = useFullApp();
  const dispatch = useDispatch();
  const { isPending, mutate: authUser } = useMutation({
    mutationKey: ["authenticateUser"],
    mutationFn: async () => {
      const { data } = await authApi.post("/");
      dispatch(setUser(data));
    },
    onError: async () => {
      const { status } = await authApi.post("/refreshAccessToken");
      if (status < 400) {
        const { data } = await authApi.post("/");
        dispatch(setUser(data));
      }
    },
  });
  useEffect(() => {
    if (!user) {
      authUser();
    }
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  if (isPending) return <LoadingBar />;
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="course/purchase" element={<PurchaseCourse />} />
        <Route
          path="course/paymentSuccessFull/:id"
          element={<PaymentSuccessFull />}
        />
        <Route path="course" element={<FreeChapterHeader />}>
          <Route index element={<WatchCourse />} />
          <Route path="chapter" element={<FreeChapterContent />} />
        </Route>
        <Route path="paidCourse" element={<PaidChapterHeader />}>
          <Route index element={<WatchPaidCourse />} />
          <Route path="chapter" element={<PaidChapterContent />} />
        </Route>
        <Route path="teacher">
          <Route path="dashboard" element={<TeacherDashboardSidebar />}>
            <Route index element={<DashboardHome />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route
              path="courses/detail/:id"
              element={<TeacherCourseDetails />}
            />
            <Route path="stats" element={<TeacherStats />} />
          </Route>
          <Route path="createCourse">
            <Route index element={<CreateCourse />} />
            <Route path=":id" element={<PublishCourse />} />
          </Route>
        </Route>
        <Route path="student">
          <Route path="dashboard" element={<StudentDashboardSidebar />}>
            <Route index element={<StudentDashboardHome />} />
            <Route path="courses" element={<StudentEnrolledCourses />} />
            <Route path="playlists">
              <Route index element={<StudentPlaylists />} />
              <Route path="watch/:playlistId" element={<WatchPlaylist />} />
            </Route>
          </Route>
          <Route path="createCourse">
            <Route index element={<CreateCourse />} />
            <Route path=":id" element={<PublishCourse />} />
          </Route>
        </Route>
        <Route path="auth">
          <Route
            path="register"
            element={
              <AuthProtector>
                <RegisterUser />
              </AuthProtector>
            }
          />
          <Route
            path="login"
            element={
              <AuthProtector>
                <LoginUser />
              </AuthProtector>
            }
          />
        </Route>
        <Route path="admin" element={<AdminPanel />}>
          <Route index element={<AdminHome />} />
          <Route path="notifications" element={<AdminNotification />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

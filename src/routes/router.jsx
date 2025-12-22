import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Clubs from "../pages/Clubs";
import ClubDetails from "../pages/ClubDetails";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";

import AdminOverview from "../pages/dashboard/admin/AdminOverview";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageClubs from "../pages/dashboard/admin/ManageClubs";
import AdminPayments from "../pages/dashboard/admin/AdminPayments";

import ManagerOverview from "../pages/dashboard/manager/ManagerOverview";
import MyClubs from "../pages/dashboard/manager/MyClubs";
import CreateClub from "../pages/dashboard/manager/CreateClub";
import EditClub from "../pages/dashboard/manager/EditClub";
import ClubMembers from "../pages/dashboard/manager/ClubMembers";
import ManagerEvents from "../pages/dashboard/manager/ManagerEvents";
import CreateEvent from "../pages/dashboard/manager/CreateEvent";
import EditEvent from "../pages/dashboard/manager/EditEvent";
import EventRegistrations from "../pages/dashboard/manager/EventRegistrations";

import MemberOverview from "../pages/dashboard/member/MemberOverview";
import MyMemberships from "../pages/dashboard/member/MyMemberships";
import MyEvents from "../pages/dashboard/member/MyEvents";
import PaymentHistory from "../pages/dashboard/member/PaymentHistory";

import Profile from "../pages/dashboard/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "clubs", element: <Clubs /> },
      { path: "clubs/:id", element: <ClubDetails /> },
      { path: "events", element: <Events /> },
      { path: "events/:id", element: <EventDetails /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "profile", element: <Profile /> },

      // Admin routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminOverview />
          </AdminRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "admin/clubs",
        element: (
          <AdminRoute>
            <ManageClubs />
          </AdminRoute>
        ),
      },
      {
        path: "admin/payments",
        element: (
          <AdminRoute>
            <AdminPayments />
          </AdminRoute>
        ),
      },

      // Manager routes
      {
        path: "manager",
        element: (
          <ManagerRoute>
            <ManagerOverview />
          </ManagerRoute>
        ),
      },
      {
        path: "manager/clubs",
        element: (
          <ManagerRoute>
            <MyClubs />
          </ManagerRoute>
        ),
      },
      {
        path: "manager/clubs/create",
        element: (
          <ManagerRoute>
            <CreateClub />
          </ManagerRoute>
        ),
      },
      {
        path: "manager/clubs/:id/edit",
        element: (
          <ManagerRoute>
            <EditClub />
          </ManagerRoute>
        ),
      },
      {
        path: "manager/clubs/:id/members",
        element: (
          <ManagerRoute>
            <ClubMembers />
          </ManagerRoute>
        ),
      },
      {
        path: "manager/events",
        element: (
          <ManagerRoute>
            <ManagerEvents />
          </ManagerRoute>
        ),
      },
      {
        path: "manager/events/create",
        element: (
          <ManagerRoute>
            <CreateEvent />
          </ManagerRoute>
        ),
      },
      {
        path: "manager/events/:id/edit",
        element: (
          <ManagerRoute>
            <EditEvent />
          </ManagerRoute>
        ),
      },
      {
        path: "manager/events/:id/registrations",
        element: (
          <ManagerRoute>
            <EventRegistrations />
          </ManagerRoute>
        ),
      },

      // Member routes
      { path: "member", element: <MemberOverview /> },
      { path: "member/memberships", element: <MyMemberships /> },
      { path: "member/events", element: <MyEvents /> },
      { path: "member/payments", element: <PaymentHistory /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

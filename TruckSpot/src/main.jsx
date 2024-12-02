import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Event from "./pages/event.jsx";
import Home from "./pages/home.jsx";
import Reservation from "./pages/reservation.jsx";
import MyAccount from "./pages/MyAccount.jsx";
import UpdateAccount from "./pages/UpdateAccount.jsx";
import EventInformation from "./pages/EventInformation.jsx";
import Trucks from "./pages/Trucks.jsx";
import AddTruck from "./Pages/AddTruck.jsx";
import UpdateTruck from "./Pages/UpdateTruck.jsx";
import AddEvent from "./pages/AddEvent.jsx";
import MyEvent from "./Pages/MyEvent.jsx";
import MyActivity from "./pages/MyActivity.jsx";
import FoodMenu from "./pages/FoodMenu.jsx";
import AddItem from "./pages/AddItem.jsx";
import VendorDashboard from "./pages/VendorDashboard.jsx";
import OrganizerDashboard from "./Pages/OrganizerDashboard.jsx";
import UpdateEvent from "./Pages/UpdateEvent.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "home",
    element: <Home />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "event",
    element: <Event />,
  },
  {
    path: "reservation",
    element: <Reservation />,
  },
  {
    path: "myaccount",
    element: <MyAccount />,
  },
  {
    path: "updateaccount",
    element: <UpdateAccount />,
  },
  {
    path: "eventinformation/:eventId",
    element: <EventInformation />,
  },
  {
    path: "vendordashboard",
    element: <VendorDashboard />,
  },
  {
    path: "organizerdashboard",
    element: <OrganizerDashboard />,
  },
  {
    path: "trucks",
    element: <Trucks />,
  },
  {
    path: "addtruck",
    element: <AddTruck />,
  },
  {
    path: "updatetruck",
    element: <UpdateTruck />,
  },
  {
    path: "addevent",
    element: <AddEvent />,
  },
  {
    path: "myevent",
    element: <MyEvent />,
  },
  {
    path: "myactivity",
    element: <MyActivity />,
  },
  {
    path: "foodmenu",
    element: <FoodMenu />,
  },
  {
    path: "additem",
    element: <AddItem />,
  },
  {
    path: "updateevent/:eventId",
    element: <UpdateEvent />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

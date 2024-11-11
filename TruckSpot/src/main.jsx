import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Event from './pages/event.jsx';
import Home from './pages/home.jsx';
import Reservation from './pages/reservation.jsx';
import MyAccount from './pages/MyAccount.jsx';
import UpdateAccount from './pages/UpdateAccount.jsx';
import EventInformation from './pages/EventInformation.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Trucks from './pages/Trucks.jsx';
import AddTruck from './pages/AddTruck.jsx';
import AddEvent from './pages/AddEvent.jsx';
import MyEvent from './pages/MyEvent.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "home",
    element: <Home/>
  },
  {
    path: "login",
    element: <Login/>
  },
  {
    path: "signup",
    element: <Signup/>
  },
  {
    path: "event",
    element: <Event/>
  },
  {
    path: "reservation",
    element: <Reservation/>
  },
  {
    path: "myaccount",
    element: <MyAccount/>
  },
  {
    path: "updateaccount",
    element: <UpdateAccount/>
  },
  {
    path: "eventinformation/:eventId",
    element: <EventInformation/>
  },
  {
    path: "dashboard",
    element: <Dashboard/>
  },
  {
    path: "trucks",
    element: <Trucks/>
  },
  {
    path: "addtruck",
    element: <AddTruck/>
  },
  {
    path: "addevent",
    element: <AddEvent/>
  }
  ,
  {
    path: "myevent",
    element: <MyEvent/>
  }



  
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

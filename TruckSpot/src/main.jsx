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
    path: "eventinformation",
    element: <EventInformation/>
  }
  ,
  {
    path: "dashboard",
    element: <Dashboard/>
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

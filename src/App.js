import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddRoomComponent from './components/room/AddRoomComponent';
import ExistingRooms from './components/room/ExitstingRooms';
import './components/styles/index.css'; 
import Home from "../src/components/home/Home";
import NavBar from './components/layout/NavBar'; 
import Footer from "../src/components/layout/Footer";
import RoomListing from './components/room/RoomListing';
import Admin from './components/admin/Admin';
import Checkout from './components/bookings/Checkout';
import BookingSuccess from '../src/components/bookings/BookingSucces';
import BookingsTableOneHotel from './components/bookings/BookingsTableOneHotel';
import BookingsTable from './components/bookings/BookingsTable';
import FindBooking from './components/bookings/FindBooking';
import Logout from './components/auth/Logout';
import Login from './components/auth/Login';
import { AuthProvider } from './components/auth/AuthProvider';
import EditRoom from './components/room/EditRoomComponent';
import RequireAuth from './components/auth/RequireAuth';
import Registration from "../src/components/auth/Registration";
import ResetPassword from "../src/components/auth/ResetPassword";
import Profile from "../src/components/auth/Profile";
import ConfirmResetPassword from '../src/components/auth/ConfirmResetPassword'
import AdminOrSuperAdminRoute from './components/home/AdminOrSuperAdminRoute';
import ExistingRooms_supper from "../src/components/room/ExistingRooms_supper"
import SuperAdmin from './components/admin/SuperAdmin';
import RegistrationOwer from './components/auth/RegistrationOwer';
import ViewRoomComponent from './components/room/ViewRoomComponent';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          {/* Bọc các route chỉ cho phép ADMIN truy cập bằng AdminRoute */}
          <AdminOrSuperAdminRoute exact path="/edit-room/:roomId" component={EditRoom} />
          <AdminOrSuperAdminRoute exact path="/existing-rooms" component={ExistingRooms} />
          <AdminOrSuperAdminRoute exact path="/add-room" component={AddRoomComponent} />

          <AdminOrSuperAdminRoute exact path="/edit-room/:roomId" component={EditRoom} />
          <AdminOrSuperAdminRoute exact path="/add-room" component={AddRoomComponent} />
          <AdminOrSuperAdminRoute exact path="/view-room/:roomId" component={ViewRoomComponent} />

          <AdminOrSuperAdminRoute exact path="/existing-roomss" component={ExistingRooms_supper} />
          <AdminOrSuperAdminRoute exact path="/existing-bookingss" component={BookingsTable} />


          

          <Route
            exact
            path="/book-room/:roomId"
            render={() => (
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            )}
          />
          <Route exact path="/browse-all-rooms" component={RoomListing} />

          <Route exact path="/admin" component={Admin} />
          <Route exact path="/supperuser" component={SuperAdmin} />
          
          <Route exact path="/booking-success" component={BookingSuccess} />

          <Route exact path="/existing-bookings" component={BookingsTableOneHotel} />
          <Route exact path="/find-booking" component={FindBooking} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Registration} />
          <Route exact path="/register-admin" component={RegistrationOwer} />
          <Route exact path="/reset-password" component={ResetPassword} />
          <Route exact path="/confirm-reset-password" component={ConfirmResetPassword} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/logout" component={Logout} />
        </Switch>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

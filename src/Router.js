import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/login/login";
import Menu from "./components/menu/menu";
import Profile from "./components/profile/profile";
import UsefulServices from "./components/usefulServices/usefulServices";
import Certificates from "./components/certificates/certificates";
import Administration from "./components/administration/administration";
import UsersList from "./components/administration/listUsers/usersList";
import UserById from "./components/administration/user/userById";
import UsefulService from "./components/administration/listUsefulServices/usefulServices";
import AdminEvents from "./components/administration/ListEvents/events";
import AdminEventById from "./components/administration/event/eventById";
import CreateEvent from "./components/administration/createEvent/createEvent";
import Events from "./components/events/eventsList/events";
import EventById from "./components/events/eventById/eventById";
import EditEvent from "./components/administration/createEvent/editEvent";
import ErrorUnauthorized from "./components/errors/error401";
import ErrorForbidden from "./components/errors/error403";
import ErrorNotFound from "./components/errors/error404";
import ErrorInternalServer from "./components/errors/error500";

function RoutesPage() {
    const location = useLocation();
    return (
        <div>
            {location.pathname !== '/login' && location.pathname !== '/' && location.pathname !== '/error401' && location.pathname !== '/error403'
                && location.pathname !== '/error404' && location.pathname !== '/error500' && localStorage.getItem('token') && <Menu />}
            <Routes>
                <Route path="/" element={<Events />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/admin" element={<Administration />} />
                <Route path="/usefulServices" element={<UsefulServices />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/users" element={<UsersList />} />
                <Route path="/admin/users/:id" element={<UserById />} />
                <Route path="/admin/event/:id" element={<AdminEventById />} />
                <Route path="/admin/usefulservice" element={<UsefulService />} />
                <Route path="/createEvent" element={<CreateEvent />} />
                <Route path="/editEvent/:id" element={<EditEvent />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventById />} />
                <Route path="/error401" element={<ErrorUnauthorized />} />
                <Route path="/error403" element={<ErrorForbidden />} />
                <Route path="/error404" element={<ErrorNotFound />} />
                <Route path="/error500" element={<ErrorInternalServer />} />
            </Routes>
        </div>
    )
};

export default RoutesPage;
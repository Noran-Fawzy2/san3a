import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Technicians from "./pages/Technicians/Technicians";
import TechnicianDetails from "./pages/Technicians/TechnicianDetails";
import Customers from "./pages/Customers/Customers";
import CustomerDetails from "./pages/Customers/CustomerDetails";
import Crafts from "./pages/Crafts/Crafts";
import Quizzes from "./pages/Quizzes/Quizzes";
import QuizDetails from "./pages/Quizzes/QuizDetails";
import Requests from "./pages/Requests/Requests";
import RequestDetails from "./pages/Requests/RequestDetails";
import Support from "./pages/Support/Support";
import TicketDetails from "./pages/Support/TicketDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/technicians" element={<Technicians />} />
          <Route path="/technicians/:id" element={<TechnicianDetails />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/crafts" element={<Crafts />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/:id" element={<QuizDetails />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/:id" element={<TicketDetails />} />
        </Route>

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
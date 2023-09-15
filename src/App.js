import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Home from "./components/Home/Home";

function App() {
  return (
    <div className="App">
      <Router>        
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/auth" element={<Auth />} />
          <Route exact path="*" element={<Home />} />
          <Route
            exact
            path="/auth"
            element={
              localStorage.getItem("token") != null ? (
                <Navigate to="/" />
              ) : (
                <Auth />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

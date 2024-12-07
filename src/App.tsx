
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import { MatchingPage } from "./pages/MatchingPage";
import { ChatPage } from "./pages/ChatPage";
import Sas from './pages/Sas';

import Profile from './pages/Profile';

function App() {

  return (
  
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/matching" element={<MatchingPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/sas" element={<Sas/>} />
              <Route path="/create" element={<Profile/>} />
            </Routes>
          </BrowserRouter>
    
  );
}

export default App;

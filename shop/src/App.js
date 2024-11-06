import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Profile from "./pages/profile";
import ProfileDetails from "./pages/profiledetails";
import Products from "./pages/Products";
import Catalogue from "./pages/Catalogue";
import AdminVerify from "./pages/adminverify";
import ProductDetails from "./pages/ProductDetails";


import Chat from "./components/chat";
function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/aboutus" element={<About/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/finish-profile" element={<ProfileDetails/>}/>
          <Route path="/add-product" element={<Products/>}/>
          <Route path="/catalogue" element={<Catalogue/>}/>
          <Route path="/adminverify" element={<AdminVerify/>}/>
          <Route path="/product/:id" element={<ProductDetails />} />


              <Route path="/chat/:sellerId" element={<Chat />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
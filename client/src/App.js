import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home/home.js";
import { Auth } from "./pages/auth/auth.js";
import { CreateRecipe } from './pages/recipe-page/create-recipe-page';
import { SavedRecipes } from './pages/saved-recipes/saved-recipes';
import { Navbar } from './components/Navbar/Navbar.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

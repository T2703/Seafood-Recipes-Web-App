import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Recipe from './Recipe';

/**
 * The header of the navbar.
 * @returns The header.
 */
function Header() {
  return (
    <header className="navbar navbar-dark bg-dark">
      <div className="container d-flex justify-content-center">
        <span className="navbar-brand mb-0 h1">Seafood Recipes</span>
      </div>
    </header>
  );
}

/**
 * Main content that is shown.
 * @returns Main content of the page.
 */
function MainContent() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const navigate = useNavigate();

  /**
   * This handles the click event for checking what recipe to look at.
   * @param {Takes in the selected sea food recipe} seaFoodRecipe 
   */
  const handleSeafoodRecipeSelect = (seaFoodRecipe) => {
    setSelectedRecipe(seaFoodRecipe);
    navigate(`/recipe/${seaFoodRecipe}`);
  }

  /**
  * This makes the search bar functional. 
  * @param {The event of the search.} e 
  */
  const handleSearchChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    console.log("Input Value:", inputValue);
    setSearchInput(inputValue);

    const filtered = recipes.filter((recipe) => {
      return recipe.strMeal.toLowerCase().includes(inputValue);
    });

    console.log("Filtered Recipes:", filteredRecipes);
    setFilteredRecipes(filtered);
  };
  
  /**
  * A function that is used to make the call request of the api.
  */
  const fetchSeafoodRecipes = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood');
      const data = await response.json();
      setRecipes(data.meals || []);
      setFilteredRecipes(data.meals || []);
    } catch (error) {
      console.error('ERROR:', error);
    } 
  };

  useEffect(() => {
    fetchSeafoodRecipes();
  }, []);
  
  return (
    <main>
      <div className="row">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search for any seafood recipes"
            onChange={handleSearchChange}
            value={searchInput} />
        </div>
        {filteredRecipes.map(recipe => (
          <div key={recipe.idMeal} className="col-md-3" onClick={() => handleSeafoodRecipeSelect(recipe.idMeal)}>
            <div className="card mb-4 shadow-sm">
              <img src={recipe.strMealThumb} className="card-img-top" alt={recipe.strMeal} />
              <div className="card-body">
                <h5 className="card-title">{recipe.strMeal}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

/**
 * Footer of the page.
 * @returns The footer.
 */
function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
      </div>
    </footer>
  );
}

/**
 * The main app page.
 * @returns The main application of the page.
 */
function App() {
  return (
    <div className="App">
        <Header />
        <MainContent />
    </div>
  );
}

/**
 * The routing of the paging for going to from one page to another.
 * This is terrible but it works until I find a proper way to make this better I will use this 
 * for now. 
 * Yeah.
 * @returns The routes for the pages.
 */
function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/recipe/:recipeId" element={<Recipe />} />
      </Routes>
    </Router>
  );
}

export default Routers;

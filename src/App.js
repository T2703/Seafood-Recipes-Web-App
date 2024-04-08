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
  const [searchInput, setSearchInput] = useState(localStorage.getItem('searchInput') || ""); // So we can store our search input.
  const [noResults, setNoResults] = useState(false); 
  const navigate = useNavigate();

  /**
   * This navigates to the seafood recipe page by passing it's id and search input as well.
   * @param {The seafood recipe id.} seaFoodRecipe 
   */
  const handleSeafoodRecipeSelect = (seaFoodRecipe) => {
    setSelectedRecipe(seaFoodRecipe);
    navigate(`/recipe/${seaFoodRecipe}?search=${searchInput}`);
  }

  /**
   * Handles the search inputs based on what the user searches.
   * @param {The search event.} e 
   */
  const handleSearchChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchInput(inputValue);
    localStorage.setItem('searchInput', inputValue);
    setNoResults(false);

  };
  
  /**
   * Fetching the API data from TheMealDB.
   */
  const fetchSeafoodRecipes = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood');
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error('ERROR:', error);
    } 
  };

  useEffect(() => {
    fetchSeafoodRecipes();
  }, []);

  /**
   * Filter based on results. 
   */
  const filteredRecipes = recipes.filter((recipe) => {
    return recipe.strMeal.toLowerCase().includes(searchInput);
  });

  return (
    <main>
      <div className="row">
        <div className="searchBar my-2 d-flex justify-content-center">
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for any seafood recipes"
              onChange={handleSearchChange}
              value={searchInput} />
          </div>
        </div>
        {searchInput && filteredRecipes.length === 0 && (
          <p className="text-center">No results found.</p>
        )}
        {filteredRecipes.map(recipe => (
          <div key={recipe.idMeal} className="col-md-3" onClick={() => handleSeafoodRecipeSelect(recipe.idMeal)}>
            <div className="card mb-4 shadow-sm">
              <img src={recipe.strMealThumb} className="card-img-top clickable" alt={recipe.strMeal} />
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

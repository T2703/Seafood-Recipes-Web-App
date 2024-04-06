import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * The recipe app page.
 * @returns The recipe page.
 */
function Recipe() {
  const [recipes, setRecipes] = useState([]);
  const { recipeId } = useParams();

  /**
  * A function that is used to make the call request of the api.
  */
    const fetchSeafoodRecipes = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();
        setRecipes(data.meals || []);
      } catch (error) {
        console.error('ERROR:', error);
      } 
    };
  
    useEffect(() => {
      fetchSeafoodRecipes();
    }, []);

    return (
      <div className="App" style={{ display: 'flex', justifyContent: 'center' }}>
        {recipes.map(recipe => (
          <div key={recipe.idMeal} className="col-md-4">
            <div className="card mb-4 shadow-sm">
              <img src={recipe.strMealThumb} className="card-img-top" alt={recipe.strMeal} />
              <div className="card-body">
                <h5 className="card-title">{recipe.strMeal}</h5>
                <h6>Instructions:</h6>
                <p className="card-text">{recipe.strInstructions}</p>
                <h6>Ingredients:</h6>
                <ul>
                  {Object.keys(recipe).map(key => {
                    if (key.startsWith('strIngredient') && recipe[key]) {
                      const ingredientNumber = parseInt(key.slice(13));
                      const measure = recipe[`strMeasure${ingredientNumber}`];
                      return (
                        <li key={key}>
                          {recipe[key]} - {measure}
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

export default Recipe;

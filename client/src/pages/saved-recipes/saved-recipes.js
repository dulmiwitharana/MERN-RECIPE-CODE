import './saved-recipe-page.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { userGetUserID } from '../../hooks/useGetUserID';

export const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [ingredientsVisible, setIngredientsVisible] = useState({});
    const userID = userGetUserID();
    
    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/recipes/savedRecipes/ids/${userID}`);
                const recipeIds = response.data.savedRecipes;
                const recipesResponse = await axios.post(`http://localhost:3000/recipes/savedRecipes`, { ids: recipeIds });
                setSavedRecipes(recipesResponse.data.savedRecipes); // Update saved recipes state
            } catch (err) {
                console.error('Error fetching saved recipes:', err.response);
            }
        };

        fetchSavedRecipes();
    }, [userID]); // Include userID in dependencies to update saved recipes when userID changes

    const toggleIngredientsVisibility = (recipeID) => {
        setIngredientsVisible(prevState => ({
            ...prevState,
            [recipeID]: !prevState[recipeID]
        }));
    };

    return (
        <div className="home">
            <h1>Saved Recipes</h1>
            <ul>
                {savedRecipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div>
                            <h2>{recipe.name}</h2>
                        </div>
                        <button onClick={() => toggleIngredientsVisibility(recipe._id)}>
                                {ingredientsVisible[recipe._id] ? "Hide Ingredients" : "Show Ingredients"}
                            </button>
                        <div className="instructions">
                            <p>{recipe.instructions}</p>
                        </div>
                        <img src={recipe.imageUrl} alt={recipe.name} />
                        <p>Cooking Time: {recipe.cookingTime} minutes</p>
                        {ingredientsVisible[recipe._id] && (
                            <div className="ingredients">
                                <h3>Ingredients</h3>
                                <ul>
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

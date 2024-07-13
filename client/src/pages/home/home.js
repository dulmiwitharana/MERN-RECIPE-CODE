import './home.css'; 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { userGetUserID } from '../../hooks/useGetUserID';
import { useCookies } from 'react-cookie';

export const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [ingredientsVisible, setIngredientsVisible] = useState({});
    const [cookies,_] = useCookies(["access_token"]);
    const userID = userGetUserID();
    
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get("http://localhost:3000/recipes");
                setRecipes(response.data);
                console.log(response.data);
            } catch (err) {
                console.error('Error fetching recipes:', err.response);
            }
        };

        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/recipes/savedRecipes/ids/${userID}`);
                setSavedRecipes(response.data.savedRecipes); // Update saved recipes state
                console.log(response.data);
            } catch (err) {
                console.error('Error fetching saved recipes:', err.response);
            }
        };

        fetchRecipes();

        if (cookies.access_token)
        fetchSavedRecipes();
    }, [userID]); // Include userID in dependencies to update saved recipes when userID changes

    const saveRecipe = async (recipeID) => {
        try {
            const response = await axios.put("http://localhost:3000/recipes", { recipeID, userID },{headers: {authorization:cookies.access_token}});
            console.log(response);
            // Optionally update savedRecipes state on successful save
            setSavedRecipes(response.data.savedRecipes);
        } catch (err) {
            console.error('Error saving recipe:', err.response);
        }
    };

    const isRecipeSaved = (id) => savedRecipes.includes(id);

    const toggleIngredientsVisibility = (recipeID) => {
        setIngredientsVisible(prevState => ({
            ...prevState,
            [recipeID]: !prevState[recipeID]
        }));
    };

    return (
        <div className="home">
            <h1>Recipes</h1>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div>
                            <h2>{recipe.name}</h2>
                            <button onClick={() => saveRecipe(recipe._id)} disabled={isRecipeSaved(recipe._id)}>
                                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                            </button>
                            <button onClick={() => toggleIngredientsVisibility(recipe._id)}>
                                {ingredientsVisible[recipe._id] ? "Hide Ingredients" : "Show Ingredients"}
                            </button>
                        </div>
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

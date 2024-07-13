import React, { useState } from 'react';
import './create-recipe-page.css'; 
import axios from 'axios';
import { userGetUserID } from '../../hooks/useGetUserID'; 
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export const CreateRecipe = () => {
    const userID = userGetUserID();
    const [cookies,_] = useCookies(["access_token"]);
    
    const [recipe, setRecipe] = useState({
        name: "",
        ingredients: [""],
        instructions: "",
        imageUrl: "",
        cookingTime: 0,
        userOwner: userID,
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleIngredientChange = (event, idx) => {
        const { value } = event.target;
        const newIngredients = [...recipe.ingredients];
        newIngredients[idx] = value;
        setRecipe({ ...recipe, ingredients: newIngredients });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form fields
        if (!validateForm()) {
            return;
        }

        console.log('Sending recipe data:', recipe);
        try {
            const response = await axios.post("http://localhost:3000/recipes", recipe,{
                headers: { authorization: cookies.access_token },
            });
            alert("Recipe Created");
            navigate("/");
        } catch (err) {
            console.error('Error response:', err.response);
            console.error('Error message:', err.message);
        }
    };

    const addIngredient = () => {
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
    };

    // Basic form validation function
    const validateForm = () => {
        // Name validation (only letters and spaces allowed)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!recipe.name.match(nameRegex)) {
            alert("Name should only contain letters and spaces.");
            return false;
        }

        // Cooking time validation (must be a positive number)
        if (recipe.cookingTime <= 0) {
            alert("Cooking time should be a positive number.");
            return false;
        }

        // Image URL validation (basic format check)
        // const imageUrlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)(\?[\w\d=&%]*)?/;

        // if (!recipe.imageUrl.match(imageUrlRegex)) {
        //     alert("Please enter a valid image URL.");
        //     return false;
        // }

        // Additional validations can be added as per requirements

        return true;
    };

    return (
        <div className="create-recipe">
            <h1>Create Recipe</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={recipe.name}
                    onChange={handleChange}
                    required
                    pattern="[a-zA-Z\s]+"
                />

                <label htmlFor="ingredients">Ingredients</label>
                <div className="ingredients-list">
                    {recipe.ingredients.map((ingredient, idx) => (
                        <input
                            key={idx}
                            type="text"
                            name={`ingredient-${idx}`}
                            value={ingredient}
                            onChange={(event) => handleIngredientChange(event, idx)}
                        />
                    ))}
                </div>
                <button type="button" className="add-ingredient-btn" onClick={addIngredient}>Add Ingredient</button>

                <label htmlFor="instructions">Instructions</label>
                <textarea
                    id="instructions"
                    name="instructions"
                    value={recipe.instructions}
                    onChange={handleChange}
                    required
                ></textarea>

                <label htmlFor="imageUrl">Image Url</label>
                <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={recipe.imageUrl}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="cookingTime">Cooking Time (minutes)</label>
                <input
                    type="number"
                    id="cookingTime"
                    name="cookingTime"
                    value={recipe.cookingTime}
                    onChange={handleChange}
                    required
                    min="1"
                />

                <button type="submit">Create Recipe</button>
            </form>
        </div>
    );
};

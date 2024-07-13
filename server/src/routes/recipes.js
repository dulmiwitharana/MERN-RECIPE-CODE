import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await RecipeModel.find({});
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", verifyToken, async (req, res) => {
    const recipe = new RecipeModel(req.body);
    try {
        const response = await recipe.save();
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/", verifyToken,async (req, res) => {
    try {
        const { recipeID, userID } = req.body;
        const recipe = await RecipeModel.findById(recipeID);
        const user = await UserModel.findById(userID);
        if (!user.savedRecipes.includes(recipeID)) {
            user.savedRecipes.push(recipe);
        }
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user?.savedRecipes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/savedRecipes", async (req, res) => {
    try {
        const { ids } = req.body;
        const savedRecipes = await RecipeModel.find({
            _id: { $in: ids },
        });
        res.json({ savedRecipes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export { router as recipesRouter };

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CategoryView.css';

const RecipesByCategory = () => {
    const { category } = useParams();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipesByCategory = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/category/${category}/`);
                setRecipes(response.data);
                console.log(response.data);
                setLoading(false);
                setError(null); // Reset error state
            } catch (error) {
                console.error('Error fetching recipes by category:', error);
                setLoading(false);
                setError('Error fetching recipes. Please try again later.');
            }
        };

        fetchRecipesByCategory();
    }, [category]);

    const handleRecipeClick = (recipeId) => {
        navigate(`/recipe/${recipeId}`);
        console.log('Clicked recipe ID:', recipeId);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const renderImages = (imageUrls) => {
        const firstImageUrl = imageUrls.match(/"(.*?)"/);

        if (firstImageUrl && firstImageUrl.length > 1) {
            const imageUrl = firstImageUrl[1].replace(/"/g, '');
            return (imageUrl);
        } else {
            console.log('No image URL found in the string:', imageUrls);
            return null;
        }
    }

    return (
        <div className="recipepage">
            <h1>Recipes in {category}</h1>
            <div className="recipe-cards-container">
                {recipes.map(recipe => (
                    <div key={recipe.id} className="recipe-card" onClick={() => handleRecipeClick(recipe.id)}>
                        <img src={renderImages(recipe.ImageURLs)} alt={recipe.Name} />
                        <div>
                            <h2>{recipe.name}</h2>
                            <p>Author: {recipe.AuthorName}</p>
                            <p>Rating: {recipe.AggregatedRating}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipesByCategory;

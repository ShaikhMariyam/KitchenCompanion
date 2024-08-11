import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link from React Router

function Favourites() {
    const token = JSON.parse(localStorage.getItem("authTokens"));
    const accessToken = token.access;
    const [user, setUser] = useState(null);
    const [recipeIds, setRecipeIds] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/user/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUser(response.data);
                setRecipeIds(response.data.profile.favorites ? response.data.profile.favorites.split(',').map(recipe => recipe.trim()) : []);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [accessToken]);

    const fetchRecipeDetails = async (recipeId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/recipe/${recipeId}/`);
            const data = response.data;
            console.log(data);

            const transformRVectorToJsonArray = (rVectorString) => {
                return rVectorString
                    .replace(/c\(/g, '[')
                    .replace(/\)/g, ']')
                    .replace(/"/g, '"')
                    .replace(/\\\//g, '/');
            };

            const renderImages = (imageUrls) => {
                const firstImageUrl = imageUrls.match(/"(.*?)"/);
                return firstImageUrl && firstImageUrl.length > 1 ? firstImageUrl[1].replace(/"/g, '') : null;
            };

            const images = renderImages(data.ImageURLs);

            return {
                ...data,
                Images: [images], // Save only the first URL as an array
            };
        } catch (error) {
            console.error(`Error fetching recipe ${recipeId}:`, error);
            return null;
        }
    };

    const recipeTable = async () => {
        const updatedRecipes = [];
        for (const recipeId of recipeIds) {
            const recipeDetails = await fetchRecipeDetails(recipeId);
            if (recipeDetails) {
                updatedRecipes.push(recipeDetails);
            }
        }
        setRecipes(updatedRecipes);
    };

    useEffect(() => {
        if (recipeIds.length > 0) {
            recipeTable(); // Fetch details for each recipe ID
        }
    }, [recipeIds]);

    const handleImageClick = (id) => {
        navigate(`/recipe/${id}`);
    };

    return (
        <div className='myrecipes'>
            <Typography variant="h4" gutterBottom>Favorites</Typography>
            {user && user.profile && user.profile.recipes ? (
                <div>
                    {recipes.length === 0 ? (
                        <div>
                            <Typography variant="body1">You have no favorite recipes yet.</Typography>
                            {/* Add button to navigate or add recipes */}
                        </div>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Recipe Image</TableCell>
                                    <TableCell>Recipe Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Keywords</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recipes.map((recipe, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Link to={`/recipe/${recipe.id}`}>
                                                <img
                                                    src={recipe.Images[0]}
                                                    alt={recipe.Name}
                                                    style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
                                                    onClick={() => handleImageClick(recipe.id)}
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell>{recipe.Name}</TableCell>
                                        <TableCell>{recipe.Description}</TableCell>
                                        <TableCell>{recipe.Keywords}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            ) : (
                <Typography variant="body1">Loading...</Typography>
            )}
        </div>
    );
}

export default Favourites;

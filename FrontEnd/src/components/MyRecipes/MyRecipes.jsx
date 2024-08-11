import React, { useState, useContext, useEffect } from 'react';
import useAxios from '../Axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './MyRecipes.css';
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Container, Button, Typography, Chip, TextField } from '@mui/material';
import swal from 'sweetalert2';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

function MyRecipes() {
    const api = useAxios();
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
                console.log(response.data);
                setUser(response.data);
                setRecipeIds(response.data.profile.recipes.split(',').map(recipe => recipe.trim()));
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [accessToken]);

    const handleAddRecipe = () => {
        navigate('/add');
    };

    const fetchRecipeDetails = async (recipeId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/recipe/${recipeId}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching recipe ${recipeId}:`, error);
        }
    };

    const recipeTable = async() => {
        const updatedRecipes = [];
        for (const recipeId of recipeIds) {
            const recipeDetails = await fetchRecipeDetails(recipeId);
            if (recipeDetails) {
                updatedRecipes.push(recipeDetails);
            }
        };
        setRecipes(updatedRecipes);
    };

    useEffect(() => {
        if (recipeIds.length > 0) {
            recipeTable(); // Fetch details for each recipe ID
        }
    }, [recipeIds]);

    const handleUpdateRecipe = (recipeId) => {
        navigate(`/update/${recipeId}`);
    };

    const handleDeleteRecipe = (recipeId) => {
        swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this recipe!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:8000/recipe/${recipeId}/`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    // Refresh recipes after delete
                    const response = await axios.get('http://127.0.0.1:8000/user/', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                        setRecipeIds(response.data.profile.recipes.split(',').map(recipe => recipe.trim()));
                    swal.fire('Deleted!', 'Your recipe has been deleted.', 'success');
                } catch (error) {
                    console.error('Error deleting recipe:', error);
                    swal.fire('Error!', 'Failed to delete recipe.', 'error');
                }
            } else if (result.dismiss === swal.DismissReason.cancel) {
                swal.fire('Cancelled', 'Your recipe is safe :)', 'info');
            }
        });
    };

    return (
        <div className='myrecipes'>
            <Typography variant="h4" gutterBottom>My Recipes</Typography>
            {user && user.profile && user.profile.recipes ? (
                <div>
                    {recipes.length === 0 ? (
                        <div>
                            <Typography variant="body1">You have created no recipes. Would you like to start now?</Typography>
                            <Button onClick={handleAddRecipe} variant="contained" color="primary">Add Recipe</Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Recipe Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recipes.map((recipe, index) => (
                                    <TableRow key={index}>
                                        {/* <TableCell>{`Recipe ID: ${recipeId}`}</TableCell> */}
                                        <TableCell>{recipe.Name}</TableCell>
                                        <TableCell>{recipe.Name}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleUpdateRecipe(recipe.id)} variant="outlined" color="primary">Update</Button>
                                            <Button onClick={() => handleDeleteRecipe(recipe.id)} variant="outlined" color="secondary">Delete</Button>
                                        </TableCell>
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

export default MyRecipes
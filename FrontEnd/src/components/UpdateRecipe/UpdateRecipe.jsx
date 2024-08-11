import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete";
import { Paper } from '@mui/material';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

const UpdateRecipe = () => {
    const { recipeId } = useParams(); // Get recipeId from URL params
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("authTokens"));
    const accessToken = token.access;

    const [user, setUser] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/user/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [accessToken]);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/ingredients/');
                setIngredients(response.data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };
        fetchIngredients();
    }, []);

    const [recipe, setRecipe] = useState({
        Name: '',
        Description: '',
        CookTime: '',
        PrepTime: '',
        TotalTime: '',
        DatePublished: '',
        ImageURLs: '',
        RecipeCategory: '',
        Keywords: '',
        RecipeIngredientQuantities: [],
        RecipeIngredientParts: [],
        AggregatedRating: '',
        ReviewCount: '',
        Calories: '',
        FatContent: '',
        CarbohydrateContent: '',
        ProteinContent: '',
        RecipeServings: '',
        RecipeYield: '',
        RecipeInstructions: []
    });

    const parseCookTime = (cookTime) => {
        const regex = /PT(\d+)H(\d+)M/;
        const match = cookTime.match(regex);
    
        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            return { hours, minutes };
        }
    
        return { hours: 0, minutes: 0 };
    };    

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/recipe/${recipeId}/`);
                const fetchedRecipe = response.data;
                console.log(response.data);

                // Convert comma-separated strings to arrays
                const ingredientPartsArray = fetchedRecipe.RecipeIngredientParts.split(',').map(item => item.trim());
                const ingredientQuantitiesArray = fetchedRecipe.RecipeIngredientQuantities.split(',').map(item => item.trim());
                const instructionsArray = fetchedRecipe.RecipeInstructions.split(',').map(item => item.trim());

                setRecipe({
                    ...fetchedRecipe,
                    RecipeIngredientParts: ingredientPartsArray,
                    RecipeIngredientQuantities: ingredientQuantitiesArray,
                    RecipeInstructions: instructionsArray
                });
            } catch (error) {
                console.error(`Error fetching recipe ${recipeId}:`, error);
            }
        };
        fetchRecipe();
    }, [accessToken, recipeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe(prevRecipe => ({
            ...prevRecipe,
            [name]: value
        }));
    };

    const handleIngredientNameChange = (index, e, { newValue }) => {
        const newIngredientNames = [...recipe.RecipeIngredientParts];
        newIngredientNames[index] = newValue;
        setRecipe(prevRecipe => ({
            ...prevRecipe,
            RecipeIngredientParts: newIngredientNames
        }));
    };

    const handleIngredientQuantityChange = (index, e) => {
        const newIngredientQuantities = [...recipe.RecipeIngredientQuantities];
        newIngredientQuantities[index] = e.target.value;
        setRecipe(prevRecipe => ({
            ...prevRecipe,
            RecipeIngredientQuantities: newIngredientQuantities
        }));
    };

    const handleMethodChange = (index, e) => {
        const newMethod = [...recipe.RecipeInstructions];
        newMethod[index] = e.target.value;
        setRecipe({ ...recipe, RecipeInstructions: newMethod });
    };

    const handleAddIngredient = () => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            RecipeIngredientParts: [...prevRecipe.RecipeIngredientParts, ''],
            RecipeIngredientQuantities: [...prevRecipe.RecipeIngredientQuantities, ''],
        }));
    };

    const handleAddMethod = () => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            RecipeInstructions: [...prevRecipe.RecipeInstructions, ''],
        }));
    };

    const handleImageChange = (e) => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            Images: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const formData = new FormData();

        formData.append('Name', recipe.Name);
        formData.append('AuthorId', user.id);
        formData.append('CookTime', recipe.CookTime);
        formData.append('PrepTime', recipe.PrepTime);
        formData.append('TotalTime', recipe.TotalTime);
        formData.append('DatePublished', recipe.DatePublished);
        formData.append('Description', recipe.Description);
        formData.append('ImageURLs', recipe.ImageURLs);
        formData.append('RecipeCategory', recipe.RecipeCategory);
        formData.append('Keywords', recipe.Keywords);
        formData.append('RecipeIngredientQuantities', recipe.RecipeIngredientQuantities.join(', '));
        formData.append('RecipeIngredientParts', recipe.RecipeIngredientParts.join(', '));
        formData.append('RecipeInstructions', recipe.RecipeInstructions.join(', '));
        formData.append('Calories', recipe.Calories);
        formData.append('FatContent', recipe.FatContent);
        formData.append('CarbohydrateContent', recipe.CarbohydrateContent);
        formData.append('ProteinContent', recipe.ProteinContent);
        formData.append('RecipeServings', recipe.RecipeServings);
        formData.append('RecipeYield', recipe.RecipeYield);

        if (recipe.Images) {
            formData.append('Images', recipe.Images);
        }

        try {
            await axios.put(`http://127.0.0.1:8000/recipe/${recipeId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            navigate('/view');
        } catch (error) {
            console.error('Error updating recipe:', error);
            setError('Error updating recipe. Please try again later.');
        }
    };

    const totalTime = () => {
        const prepHours = parseInt(recipe.PrepHours, 10) || 0;
        const prepMinutes = parseInt(recipe.PrepMinutes, 10) || 0;
        const cookHours = parseInt(recipe.CookHours, 10) || 0;
        const cookMinutes = parseInt(recipe.CookMinutes, 10) || 0;
        const totalHours = prepHours + cookHours;
        const totalMinutes = prepMinutes + cookMinutes;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `PT${totalHours + hours}H${minutes}M`;
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Update Recipe</Typography>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <TextField
                    fullWidth
                    label="Recipe Name"
                    name="Name"
                    value={recipe.Name}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    label="Description"
                    name="Description"
                    value={recipe.Description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                />
                <div>
                    <Typography variant="h6">Preparation Time</Typography>
                    <div className="time-dropdowns">
                        <TextField
                            select
                            label="Hours"
                            name="PrepHours"
                            value={recipe.PrepTime ? parseInt(recipe.PrepTime.substring(2, recipe.PrepTime.indexOf('H')), 10) : ''}
                            onChange={handleChange}
                            variant="outlined"
                            style={{ marginRight: '20px', width: '120px' }}
                        >
                            {[...Array(24).keys()].map((hour) => (
                                <option key={hour} value={hour}>{hour} hours</option>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Minutes"
                            name="PrepMinutes"
                            value={recipe.PrepTime ? parseInt(recipe.PrepTime.substring(recipe.PrepTime.indexOf('H') + 1, recipe.CookTime.indexOf('M')), 10) : ''}
                            onChange={handleChange}
                            variant="outlined"
                            style={{ width: '120px' }}
                        >
                            {[15, 30, 45, 60].map((minute) => (
                                <option key={minute} value={minute}>{minute} minutes</option>
                            ))}
                        </TextField>
                    </div>
                </div>
                <div>
                    <Typography variant="h6">Cooking Time</Typography>
                    <div className="time-dropdowns">
                        <TextField
                            select
                            label="Hours"
                            name="CookHours"
                            value={recipe.CookTime ? parseInt(recipe.CookTime.substring(2, recipe.CookTime.indexOf('H')), 10) : ''}
                            onChange={handleChange}
                            variant="outlined"
                            style={{ marginRight: '20px', width: '120px' }}
                        >
                            {[...Array(24).keys()].map((hour) => (
                                <option key={hour} value={hour}>{hour} hours</option>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Minutes"
                            name="CookMinutes"
                            value={recipe.CookTime ? parseInt(recipe.CookTime.substring(recipe.CookTime.indexOf('H') + 1, recipe.CookTime.indexOf('M')), 10) : ''}
                            onChange={handleChange}
                            variant="outlined"
                            style={{ width: '120px' }}
                        >
                            {[15, 30, 45, 60].map((minute) => (
                                <option key={minute} value={minute}>{minute} minutes</option>
                            ))}
                        </TextField>
                    </div>
                </div>
                <div>
                    <Typography variant="h6">Total Time</Typography>
                    <Typography>{totalTime()}</Typography>
                </div>
                <div>
                    <div>
                        <Typography variant="h6">Ingredients</Typography>
                        {recipe.RecipeIngredientParts.map((ingredient, index) => (
                            <div key={index} className="ingredient">
                                <Autocomplete
                                    disablePortal
                                    value={ingredient}
                                    onChange={(event, newValue) => handleIngredientNameChange(index, event, { newValue })}
                                    freeSolo
                                    inputValue={ingredient}
                                    options={ingredients}
                                    PaperComponent={Paper}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Add specific ingredient"
                                            variant="outlined"
                                            fullWidth
                                            style={{ width: 300 }}
                                        />
                                    )}
                                />
                                <TextField
                                    type="text"
                                    label="Quantity"
                                    value={recipe.RecipeIngredientQuantities[index]}
                                    onChange={(e) => handleIngredientQuantityChange(index, e)}
                                    variant="outlined"
                                />
                            </div>
                        ))}
                        <Button type="button" variant="contained" onClick={handleAddIngredient}>
                            Add More Ingredients
                        </Button>
                    </div>
                </div>
                <div>
                    <Typography variant="h6">Method</Typography>
                    {recipe.RecipeInstructions.map((step, index) => (
                        <div key={index} className="method">
                            <TextField
                                type="text"
                                label={`Step ${index + 1}`}
                                value={step}
                                onChange={(e) => handleMethodChange(index, e)}
                                variant="outlined"
                                fullWidth
                            />
                        </div>
                    ))}
                    <Button type="button" variant="contained" onClick={handleAddMethod}>
                        Add More Steps
                    </Button>
                </div>
                <div>
                    <Typography variant="h6">Nutritional Information</Typography>
                    <TextField
                        type="text"
                        label="Calories"
                        name="Calories"
                        value={recipe.Calories}
                        onChange={handleChange}
                        variant="outlined"
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        type="text"
                        label="Fat Content"
                        name="FatContent"
                        value={recipe.FatContent}
                        onChange={handleChange}
                        variant="outlined"
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        type="text"
                        label="Carbohydrate Content"
                        name="CarbohydrateContent"
                        value={recipe.CarbohydrateContent}
                        onChange={handleChange}
                        variant="outlined"
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        type="text"
                        label="Protein Content"
                        name="ProteinContent"
                        value={recipe.ProteinContent}
                        onChange={handleChange}
                        variant="outlined"
                        style={{ marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <TextField
                        type="text"
                        label="Image URLs"
                        name="ImageURLs"
                        value={recipe.ImageURLs}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        type="text"
                        label="Recipe Category"
                        name="RecipeCategory"
                        value={recipe.RecipeCategory}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        type="text"
                        label="Keywords"
                        name="Keywords"
                        value={recipe.Keywords}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        type="text"
                        label="Recipe Yield"
                        name="RecipeYield"
                        value={recipe.RecipeYield}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        type="text"
                        label="Recipe Servings"
                        name="RecipeServings"
                        value={recipe.RecipeServings}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </div>
                <Button type="submit" variant="contained" color="primary">
                    Update Recipe
                </Button>
            </form>
        </Container>
    );
};

export default UpdateRecipe;

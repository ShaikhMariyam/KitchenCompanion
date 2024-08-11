import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { Container, Button, Grid, Typography, Card, CardContent, CardMedia, Chip } from '@mui/material';
import axios from 'axios';
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

const SearchIngredients = () => {
    const [ingredients, setIngredients] = useState([]);
    const [ingredientInput, setIngredientInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]); // List of all ingredients for autosuggest
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("authTokens"));
    const accessToken = token.access;
    console.log(accessToken);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/ingredients/');
                setAllIngredients(response.data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };
        fetchIngredients();
    }, []);

    const StyledPaper = styled(Paper)(({ theme }) => ({
        "& .MuiAutocomplete-listbox": {
            display: "block",
        },
    }));


    const handleCardClick = (id) => {
        navigate(`/recipe/${id}`);
    };

    const handleAddIngredient = (ingredient) => {
        if (!ingredients.includes(ingredient) && ingredients.length < 20) {
            setIngredients([...ingredients, ingredient]);
        }
    };

    const handleRemoveIngredient = (ingredientToRemove) => {
        setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/search-by-ingredients/', {
                params: { ingredients: ingredients.join(',') }, // Corrected to params
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setRecipes(response.data);
        } catch (error) {
            console.log('Error searching recipes:', error);
        }
    };
    
    const handleSuggestionsFetchRequested = ({ value }) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        const filteredSuggestions = inputLength === 0 ? [] : allIngredients.filter(ingredient =>
            ingredient.toLowerCase().includes(inputValue)
        );

        setSuggestions(filteredSuggestions);
    };

    const handleSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const handleIngredientNameChange = (event, { newValue }) => {
        setIngredientInput(newValue);
    };

    const handleSuggestionSelected = (event, { suggestion }) => {
        handleAddIngredient(suggestion);
        setIngredientInput('');
    };

    const popularIngredients = ['Flour', 'Sugar', 'Milk', 'Salt', 'Butter', 'Eggs', 'Oil', 'Baking Powder', 'Baking Soda'];

    const renderImages = (imageUrls) => {
        if (imageUrls && imageUrls !== 'character(0)') {
            const urlsArray = imageUrls.replace(/c\(|\)|"/g, '').split(', ');
            if (urlsArray.length > 0 && urlsArray[0]) {
                return (
                    <CardMedia
                        component="img"
                        height="140"
                        image={urlsArray[0]}
                        alt="Recipe"
                    />
                );
            }
        }

        return (
            <Typography variant="body2" color="textSecondary">
                No image available
            </Typography>
        );
    };

    return (
        <Container>
            <Typography variant="h3" gutterBottom>Search Recipes by Ingredients</Typography>
            <Typography variant="body1">Enter at least 3 ingredients to find your recipe.</Typography>
            {/* <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={handleSuggestionsClearRequested}
                getSuggestionValue={(suggestion) => suggestion}
                renderSuggestion={(suggestion) => <div>{suggestion}</div>}
                inputProps={{
                    placeholder: 'Enter ingredient',
                    value: ingredientInput,
                    onChange: handleIngredientNameChange,
                }}
                onSuggestionSelected={handleSuggestionSelected}
            /> */}
            {/* <Autocomplete
                disablePortal
                PaperComponent={StyledPaper}
                id="combo-box-demo"
                options={allIngredients}
                getOptionLabel={(option) => option}
                sx={{ width: 300 }}
                value={ingredientInput}
                onChange={(event, newValue) => setIngredientInput(newValue)}
                renderInput={(params) => <TextField
                    {...params}
                    label="Enter ingredient"
                    variant="outlined"
                    placeholder="Start typing..." />
                }
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault(); // Prevent default behavior (adding text)
                        const selectedIngredient = allIngredients.find(
                            (ing) => ing.toLowerCase() === ingredientInput.toLowerCase()
                        );
                        if (selectedIngredient) {
                            handleAddIngredient(selectedIngredient);
                        } else {
                            alert('Please select an existing ingredient from the list.');
                        }
                    }
                }}
            /> */}
            <Autocomplete
                disablePortal
                PaperComponent={StyledPaper}
                id="combo-box-demo"
                options={allIngredients}
                getOptionLabel={(option) => option}
                value={ingredientInput}
                onChange={(event, newValue) => setIngredientInput(newValue)}
                inputValue={ingredientInput}  // Add inputValue prop
                onInputChange={(event, newInputValue) => setIngredientInput(newInputValue)}  // Add onInputChange prop
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Enter ingredient"
                        variant="outlined"
                        placeholder="Start typing..."
                    />
                )}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault(); // Prevent default behavior (adding text)
                        const selectedIngredient = allIngredients.find(
                            (ing) => ing.toLowerCase() === ingredientInput.toLowerCase()
                        );
                        if (selectedIngredient) {
                            handleAddIngredient(selectedIngredient);
                            setIngredientInput('');  // Clear input after adding ingredient
                        } else {
                            alert('Please select an existing ingredient from the list.');
                        }
                    }
                }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>Common Ingredients</Typography>
            <div>
                {popularIngredients.map((ingredient, index) => (
                    <Chip
                        key={index}
                        label={ingredient}
                        onClick={() => handleAddIngredient(ingredient)}
                        sx={{ m: 0.5, cursor: 'pointer' }}
                    />
                ))}
            </div>

            <Typography variant="h6" sx={{ mt: 2 }}>Your ingredients</Typography>
            <div>
                {ingredients.map((ingredient, index) => (
                    <Chip
                        key={index}
                        label={ingredient}
                        onDelete={() => handleRemoveIngredient(ingredient)}
                        sx={{ m: 0.5 }}
                    />
                ))}
            </div>
            <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mt: 2 }}>
                Search
            </Button>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {recipes.map((recipe) => (
                    <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                        <Card onClick={() => handleCardClick(recipe.id)} sx={{ maxWidth: 345, margin: 2 }}>
                            {renderImages(recipe.ImageURLs)}
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {recipe.Name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {recipe.AuthorName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {recipe.RecipeCategory}
                                </Typography>
                                <Button size="small" onClick={() => handleCardClick(recipe.id)}>View Details</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default SearchIngredients;

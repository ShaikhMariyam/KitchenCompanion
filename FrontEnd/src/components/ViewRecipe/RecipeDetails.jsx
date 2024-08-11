import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box, Grid, Divider, Button, IconButton } from '@mui/material';
import { List, ListItem, ListItemText, TextField, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorderOutlined as FavoriteBorderIcon } from '@mui/icons-material';
import NavBar from '../NavBar/NavBar';
import axios from 'axios';
import swal from 'sweetalert2';
import './RecipeDetails.css';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [favorited, setFavorited] = useState(false); 

    const token = JSON.parse(localStorage.getItem("authTokens"));
    const accessToken = token.access;
    const [user, setUser] = useState(null);  

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/recipe/${id}/`);
                const data = response.data;

                const renderImages = (imageUrls) => {
                    const firstImageUrl = imageUrls.match(/"(.*?)"/);
                    return firstImageUrl && firstImageUrl.length > 1 ? firstImageUrl[1].replace(/"/g, '') : null;
                };
    
                const images = renderImages(data.ImageURLs);
    
                    const keywords = data.Keywords;

                setRecipe({
                    ...data,
                    Images: images,
                    Keywords: keywords.split(', '),
                    RecipeIngredientQuantities: data.RecipeIngredientQuantities.split(', '),
                    RecipeIngredientParts: data.RecipeIngredientParts.split(', '),
                    RecipeInstructions: data.RecipeInstructions.split('.')
                });
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };

        fetchRecipe();
    }, [id]);

    if (!recipe) {
        return <Typography variant="h5">Loading...</Typography>;
    }

    const toggleFavorite = async () => {
        try {
            // Determine the endpoint based on current favorited state
            const endpoint = favorited ? 'http://127.0.0.1:8000/removeFavorite/' : 'http://127.0.0.1:8000/addFavorite/';
            
            // Make POST request to add/remove favorite
            await axios.put(endpoint, { recipeId: id }, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });

            // Update local state to reflect the change
            setFavorited(!favorited);
                    const action = favorited ? 'removed from' : 'added to';
        swal.fire({
            icon: 'success',
            title: `Recipe ${action} favorites!`,
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
        });

        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <Container>
            <Box sx={{ marginTop: 4 }}>
                <Paper sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                    <Typography variant="h3" gutterBottom>{recipe.Name}</Typography>
                    <Typography variant="h6" gutterBottom>By {recipe.AuthorName}</Typography>
                    <Typography variant="body1" gutterBottom>{recipe.Description}</Typography>
                    <IconButton
                        onClick={toggleFavorite}
                        color={favorited ? 'secondary' : 'default'} // Adjust color based on favorited state
                    >
                        {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>

                </Paper>
                <Box
                    component="img"
                    sx={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        marginBottom: 2,
                        borderRadius: 2,
                    }}
                    alt={recipe.Name}
                    src={recipe.Images}
                />
                <Paper sx={{ padding: 4, borderRadius: 2, marginBottom: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6">Ingredients</Typography>
                            <ol>
                                {recipe.RecipeIngredientParts.map((ingredient, index) => (
                                    <li key={index}>
                                        <Typography variant="body1">{"◆ "}{recipe.RecipeIngredientQuantities[index]} {ingredient}</Typography>
                                    </li>
                                ))}
                            </ol>
                            <Typography variant="h6" sx={{ mt: 2 }}>Instructions</Typography>
                            <ol>
                                {recipe.RecipeInstructions.map((instruction, index) => (
                                    <li key={index}>
                                        <Typography variant="body1">{instruction.trim().startsWith(', ') ? instruction.trim().substring(2) : instruction.trim()}</Typography>
                                    </li>
                                ))}
                            </ol>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, marginBottom: 2 }}>
                                <Typography variant="h6">Nutritional Information</Typography>
                                <Typography variant="body2">Calories: {recipe.Calories}</Typography>
                                <Typography variant="body2">Carbs: {recipe.CarbohydrateContent}</Typography>
                                <Typography variant="body2">Fat: {recipe.FatContent}</Typography>
                                <Typography variant="body2">Protein: {recipe.ProteinContent}</Typography>
                            </Paper>
                            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, marginTop: 2 }}>
                                <Typography variant="h6">Keywords</Typography>
                                <Box component="ul" sx={{ paddingLeft: 3 }}>
                                    {recipe.Keywords.map((keyword, index) => (
                                        <li key={index}>
                                            <Typography variant="body2">{keyword}</Typography>
                                        </li>
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
                {/* <Typography variant="h5" sx={{ marginBottom: 2 }}>Comments</Typography>
                <Box sx={{ marginBottom: 4 }}>
                    <Typography variant="body2" color="textSecondary">Synth post-ironic chia ennui pickled. Vegan church-key tousled.</Typography>
                    <Typography variant="body2" color="textSecondary">Synth post-ironic chia ennui pickled. Vegan church-key tousled.</Typography>
                </Box>
                <Button variant="contained" color="primary" sx={{ marginBottom: 4 }}>Load 25 more comments</Button>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>Write a comment</Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Write a comment..."
                    sx={{ marginBottom: 4 }}
                />
                <Button variant="contained" color="primary">Post comment</Button>
                <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>You might also like</Typography> */}
                {/* <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                alt="Cranberry Meringue Ice Cream Cake"
                                height="140"
                                image={recipe.Images[0]}  // Replace with actual image URL
                            />
                            <CardContent>
                                <Typography variant="h6">Cranberry Meringue Ice Cream Cake</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">View Recipe</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                alt="No Bake Cheesecake"
                                height="140"
                                image={recipe.Images[1]}  // Replace with actual image URL
                            />
                            <CardContent>
                                <Typography variant="h6">No Bake Cheesecake</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">View Recipe</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                alt="Devil's Thick Layered Sponge Cake"
                                height="140"
                                image={recipe.Images[2]}  // Replace with actual image URL
                            />
                            <CardContent>
                                <Typography variant="h6">Devil's Thick Layered Sponge Cake</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">View Recipe</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid> */}
            </Box>
        </Container>
    );
};

export default RecipeDetails;

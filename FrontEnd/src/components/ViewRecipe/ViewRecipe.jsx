import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Pagination, Container, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import AxiosInstance from '../Axios';
import axios from 'axios';
import Rating from '@mui/material/Rating';

const ViewRecipe = () => {
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecipes();
    }, [page]);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/recipe');
            setRecipes(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 10));
        } catch (error) {
            console.log('Error fetching recipes:', error);
        }
    };

    const handleCardClick = (id) => {
        navigate(`/recipe/${id}`);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

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
            <Typography variant="h3" gutterBottom>View Recipes</Typography>
            <Grid container spacing={2}>
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
                                <Rating name="recipe-rating" value={recipe.AggregatedRating} readOnly />
                                    {recipe.AggregatedRating}
                                <Button size="small" onClick={() => handleCardClick(recipe.id)}>View Details</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
            />
        </Container>
    );
};

export default ViewRecipe;

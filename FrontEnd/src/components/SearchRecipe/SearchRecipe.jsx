import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const SearchRecipe = () => {
    const query = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (query) {
            handleSearch();
            console.log(query);
        }
    }, [query]);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/search/', {
                params: {
                    query: query.query
                }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.log('Error searching recipes:', error);
        }
    };

    const handleImageClick = (id) => {
        navigate(`/recipe/${id}`);
    };

    const renderImages = (imageUrls) => {
        const firstImageUrl = imageUrls.match(/"(.*?)"/);

        if (firstImageUrl && firstImageUrl.length > 1) {
            const imageUrl = firstImageUrl[1].replace(/"/g, '');
            return (
                <img src={imageUrl} alt="Recipe" style={{ width: '100px', height: 'auto' }} />
            );
        } else {
            console.log('No image URL found in the string:', imageUrls);
            return null;
        }
    };

    return (
        <div>
            <Link to="/ingredients">
                <Button variant="contained" style={{ marginBottom: '0px', marginLeft: '300px' }}>Search by Ingredients</Button>
            </Link>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Images</TableCell>
                            <TableCell>Recipe Name</TableCell>
                            <TableCell>Author Name</TableCell>
                            <TableCell>Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchResults.map((recipe, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Link to={`/recipe/${recipe.id}`}>
                                    {renderImages(recipe.ImageURLs)}
                                    </Link>
                                </TableCell>
                                <TableCell>{recipe.Name}</TableCell>
                                <TableCell>{recipe.AuthorName}</TableCell>
                                <TableCell>{recipe.RecipeCategory}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default SearchRecipe;
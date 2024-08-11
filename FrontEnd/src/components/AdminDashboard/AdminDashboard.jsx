import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { Typography, Button, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, AppBar, Toolbar, IconButton } from '@mui/material';
import swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; // Icon for Add Admin button

function AdminDashboard() {
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("authTokens"));
    const accessToken = token.access;

    useEffect(() => {
        fetchRecipes();
    }, [page, rowsPerPage]);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/recipe/?offset=${page * rowsPerPage}&limit=${rowsPerPage}`);
            setRecipes(response.data.results);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const handleAddRecipe = () => {
        navigate('/add');
    };

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
                    fetchRecipes();
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleImageClick = (recipeId) => {
        navigate(`/recipe/${recipeId}`);
    };

    const renderImages = (imageUrls) => {
        const firstImageUrl = imageUrls.match(/"(.*?)"/);
        return firstImageUrl && firstImageUrl.length > 1 ? firstImageUrl[1].replace(/"/g, '') : null;

        
    };

    return (
        <div className='admindashboard'>
            <AppBar position="static">
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    <Typography variant="h4" gutterBottom>All Recipes</Typography>
                    <div>
                        <IconButton onClick={() => navigate('/admin')} color="inherit">
                            <AddIcon />
                        </IconButton>
                        <Button onClick={() => navigate('/adminreport')} variant="outlined" color="inherit">Report</Button>
                    </div>
                </Toolbar>
            </AppBar>
            {recipes.length === 0 ? (
                <div>
                    <Typography variant="body1">No recipes found. Would you like to add one?</Typography>
                    <Button onClick={handleAddRecipe} variant="contained" color="primary">Add Recipe</Button>
                </div>
            ) : (
                <>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Recipe Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recipes.map((recipe, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Link to={`/recipe/${recipe.id}`}>
                                            <img
                                                src={renderImages(recipe.ImageURLs)}
                                                alt={recipe.Name}
                                                style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
                                                onClick={() => handleImageClick(recipe.id)}
                                            />
                                        </Link>
                                    </TableCell>

                                    <TableCell>{recipe.Name}</TableCell>
                                    <TableCell>{recipe.Description}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleUpdateRecipe(recipe.id)} variant="outlined" color="primary">Update</Button>
                                        <Button onClick={() => handleDeleteRecipe(recipe.id)} variant="outlined" color="secondary">Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={1000} // Replace with the total count of recipes
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
        </div>
    );
}

export default AdminDashboard;

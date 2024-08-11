import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Divider, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import './AdminReport.css'; // Import your CSS file

const AdminReport = () => {
    const [reports, setReports] = useState([]);
    const token = JSON.parse(localStorage.getItem("authTokens"));
    const accessToken = token.access;

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/reports/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    return (
        <div className="admin-report-container">
            <Typography variant="h4" className="section-header" gutterBottom>Admin Reports</Typography>

            {/* User Registration and Activity */}
            <List>
                <ListItem className="list-item">
                    <ListItemText primary="User Registration and Activity" />
                </ListItem>
                <ListItem className="list-item">
                    <ListItemText primary={`Registered Users: ${reports.registered_users}`} />
                </ListItem>
                <ListItem className="list-item">
                    <ListItemText primary={`Active Users: ${reports.active_users}`} />
                </ListItem>
                <Divider className="divider" />
            </List>

            {/* Top Recipe Ratings */}
            <div className="table-container">
                <Typography variant="h5" className="section-subheader">Top Recipe Ratings</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Recipe</TableCell>
                                <TableCell align="right">Ratings</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.top_rated_recipes && reports.top_rated_recipes.map((recipe, id) => (
                                <TableRow key={id}>
                                    <TableCell>{recipe.name}</TableCell>
                                    <TableCell align="right">{recipe.rating}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider className="divider" />
            </div>

            {/* Ingredients Usage - Table Structure */}
            <div className="table-container">
                <Typography variant="h5" className="section-subheader">Ingredients Usage</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ingredient</TableCell>
                                <TableCell align="right">Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.ingredients_usage && reports.ingredients_usage.map((ingredient, id) => (
                                <TableRow key={id}>
                                    <TableCell>{ingredient.ingredient}</TableCell>
                                    <TableCell align="right">{ingredient.count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider className="divider" />
            </div>

            {/* Recipe Categories - Table Structure */}
            <div className="table-container">
                <Typography variant="h5" className="section-subheader">Recipe Categories</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.recipe_categories && reports.recipe_categories.map((category, id) => (
                                <TableRow key={id}>
                                    <TableCell>{category.category}</TableCell>
                                    <TableCell align="right">{category.count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider className="divider" />
            </div>

            {/* New Recipe Additions - Table Structure */}
            <div className="table-container">
                <Typography variant="h5" className="section-subheader">New Recipe Additions</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Recipe Name</TableCell>
                                <TableCell align="right">Added Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.new_recipes && reports.new_recipes.map(recipe => (
                                <TableRow key={recipe.id}>
                                    <TableCell>{recipe.Name}</TableCell>
                                    <TableCell align="right">{recipe.AuthorName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider className="divider" />
            </div>
        </div>
    );
};

export default AdminReport;

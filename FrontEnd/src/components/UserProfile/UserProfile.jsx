import React, { useState, useContext, useEffect } from 'react';
import useAxios from '../Axios';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './UserProfile.css';
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Container, Button, Typography, Chip, TextField } from '@mui/material';
import swal from 'sweetalert2';

const Dashboard = () => {
  const [response, setResponse] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const api = useAxios();
  const token = JSON.parse(localStorage.getItem("authTokens"));
  const accessToken = token.access;
  const { logoutUser } = useContext(AuthContext);
  const [allIngredients, setAllIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [user, setUser] = useState(null);

  const ALLERGY_TO_PRODUCTS = {
    'Dairy': ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream'],
    'Eggs': ['Egg', 'Mayonnaise', 'Custard', 'Pasta'],
    'Peanuts': ['Peanut Butter', 'Peanut Oil', 'Peanut Flour'],
    'Wheat': ['Flour', 'Cake Flour', 'Bread', 'Pasta'],
    'Fish': ['Salmon', 'Tuna', 'Cod', 'Sardines'],
    'Shellfish': ['Shrimp', 'Crab', 'Lobster', 'Mussels'],
    'Soy': ['Tofu', 'Soy Milk', 'Soy Sauce', 'Edamame']
  }

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

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/user/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
        console.log(response.data);
        setSelectedAllergies(response.data.profile.allergies.split(',').map(allergy => allergy.trim()));
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [accessToken]);

  const StyledPaper = styled(Paper)(({ theme }) => ({
    "& .MuiAutocomplete-listbox": {
      display: "block",
    },
  }));

  const commonAllergies = ['Dairy', 'Eggs', 'Peanuts', 'Wheat', 'Fish', 'Shellfish', 'Soy'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/test/");
        setResponse(response.data.response);
      } catch (error) {
        console.log(error);
        setResponse("Something Went Wrong");
      }
    };

    fetchData();
  }, [api]);

  const handleAddAllergy = (allergy) => {
    setSelectedAllergies(prevAllergies => [...prevAllergies, allergy]);
  };

  const handleDeleteAllergy = (allergyToDelete) => {
    setSelectedAllergies(prevAllergies => prevAllergies.filter(a => a !== allergyToDelete));
  };

  const handleInputChange = (event, value) => {
    setIngredientInput(value);
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim() !== "") {
      setSelectedAllergies(prevAllergies => [...prevAllergies, ingredientInput]);
      setIngredientInput("");
    }
  };

  // const handleSaveAllergies = async () => {
  //   try {
  //     const allergylist = "";
  //     const response = await axios.put('http://127.0.0.1:8000/save_allergies/', { allergies: selectedAllergies.join(','), allergylist: selectedAllergies.join(',') }, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     console.log('Allergies saved successfully:', response.data);
  //     console.log('Allergies saved successfully:', selectedAllergies.join(','));
  //     swal.fire({
  //       title: "Allergies saved successfully",
  //       icon: "success",
  //       toast: true,
  //       timer: 6000,
  //       position: 'top-right',
  //       timerProgressBar: true,
  //       showConfirmButton: false
  //     })
  //   } catch (error) {
  //     console.error('Error saving allergies:', error);
  //   }
  // };

  const handleSaveAllergies = async () => {
    try {
      // Prepare the user's allergies including common allergies and user-added ingredients
      const allAllergies = [...selectedAllergies];
      
      // Create a list of individual items for each selected common allergy
      const allergyList = allAllergies.flatMap(allergy => ALLERGY_TO_PRODUCTS[allergy] || [allergy]);
      
      // Filter out duplicates and construct the final allergy list string
      const uniqueAllergyList = Array.from(new Set(allergyList)).join(',');
  
      // Send the API request to save allergies including the expanded allergy list
      const response = await axios.put(
        'http://127.0.0.1:8000/save_allergies/',
        { 
          allergies: selectedAllergies.join(','),  // Sending just selected allergies as per requirement
          allergylist: uniqueAllergyList  // Sending the expanded allergy list
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log('Allergies saved successfully:', response.data);
  
      // Show success message to the user
      swal.fire({
        title: "Allergies saved successfully",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error saving allergies:', error);
    }
  };  

  if (!user) {
    return null; // or loading indicator
  }

  return (
    <div className='dashboard-container'>
      <div className='dashboard-content'>
        <h1 className='dashboard-title'>Profile</h1>
        <div className='welcome-message'>
          <p>Welcome, {user.profile.full_name}</p>
        </div>
        <div className='user-info'>
          <p className='info-item'><span className='info-label'>UserID:</span> {user.profile.id}</p>
          <p className='info-item'><span className='info-label'>Full Name:</span> {user.profile.full_name}</p>
          <p className='info-item'><span className='info-label'>Email:</span> {user.email}</p>
          <div className='info-item'>
            <span className='info-label'>Allergies:</span>
            <div>
              {selectedAllergies.map((allergy, index) => (
                <Chip
                  key={index}
                  label={allergy}
                  onDelete={() => handleDeleteAllergy(allergy)}
                  sx={{ m: 0.5, cursor: 'pointer' }}
                />
              ))}
            </div>

            <div style={{ marginTop: '10px' }}>
              <Autocomplete
                disablePortal
                value={ingredientInput}
                onChange={handleInputChange}
                freeSolo
                options={allIngredients}
                PaperComponent={StyledPaper}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add specific ingredient"
                    variant="outlined"
                    fullWidth
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddIngredient();
                      }
                    }}
                  />
                )}
              />
              <Button onClick={handleAddIngredient} variant="contained" color="primary" sx={{ mt: 1 }}>
                Add Ingredient
              </Button>
            </div>
            <Button onClick={handleSaveAllergies} variant="contained" color="primary" sx={{ mt: 1 }}>
              Save Allergies
            </Button>
          </div>
        </div>
        <Typography variant="h6" sx={{ mt: 2 }}>Common Allergies: </Typography>
        <div>
          {commonAllergies.map((allergy, index) => (
            <Chip
              key={index}
              label={allergy}
              onClick={() => handleAddAllergy(allergy)}
              sx={{ m: 0.5, cursor: 'pointer' }}
            />
          ))}
        </div>
        <div className='api-response'>
          <p className='response-message'>{response}</p>
        </div>
        <div className='dashboard-links'>
          <Link to='/' className='dashboard-link'>Home</Link>
          <Link onClick={logoutUser} className='dashboard-link'>Logout</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

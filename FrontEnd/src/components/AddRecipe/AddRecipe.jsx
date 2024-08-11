import React, { useState, useEffect } from 'react';
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Container, Button, Typography, Chip, TextField } from '@mui/material';
import { Paper } from '@mui/material';
import './AddRecipe.css';

const AddRecipe = () => {
  const token = JSON.parse(localStorage.getItem("authTokens"));
  const accessToken = token.access;
  const [user, setUser] = useState(null);

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
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [accessToken]);

  const [recipe, setRecipe] = useState({
    Name: '',
    AuthorId: '',
    CookTime: '',
    CookHours: '',
    CookMinutes: '',
    PrepTime: '',
    PrepHours: '',
    PrepMinutes: '',
    TotalTime: '',
    DatePublished: '',
    Description: '',
    ImageURLs: '',
    RecipeCategory: 'Asian Cuisine',
    Keywords: '',
    RecipeIngredientQuantities: [''],
    RecipeIngredientParts: [''],
    RecipeInstructions: [''],
    Images: null,
    Calories: '',
    FatContent: '',
    CarbohydrateContent: '',
    ProteinContent: '',
    RecipeServings: '',
    RecipeYield: '',
  });

  // const [suggestions, setSuggestions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => {
      let newTime = '';
      const updatedRecipe = { ...prevRecipe, [name]: value };
      if (name === 'PrepHours' || name === 'PrepMinutes') {
        newTime = `PT${updatedRecipe.PrepHours}H${updatedRecipe.PrepMinutes}M`;
        updatedRecipe.PrepTime = newTime;
      } else if (name === 'CookHours' || name === 'CookMinutes') {
        newTime = `PT${updatedRecipe.CookHours}H${updatedRecipe.CookMinutes}M`;
        updatedRecipe.CookTime = newTime;
      }
      return updatedRecipe;
    });
  };

  const handleIngredientNameChange = (index, e, { newValue }) => {
    const newIngredientNames = [...recipe.RecipeIngredientParts];
    newIngredientNames[index] = newValue;
    setRecipe({ ...recipe, RecipeIngredientParts: newIngredientNames });
  };

  const handleIngredientQuantityChange = (index, e) => {
    const newIngredientQuantities = [...recipe.RecipeIngredientQuantities];
    newIngredientQuantities[index] = e.target.value;
    setRecipe({ ...recipe, RecipeIngredientQuantities: newIngredientQuantities });
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
      RecipeIngredientQuantities: [...prevRecipe.RecipeIngredientQuantities, '']
    }));
  };

  const handleAddMethod = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      RecipeInstructions: [...prevRecipe.RecipeInstructions, '']
    }));
  };

  const handleImageChange = (e) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      Images: e.target.files[0]
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
    formData.append('TotalTime', totalTime());
    formData.append('DatePublished', currentDate);
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
      const response = await axios.post('http://127.0.0.1:8000/recipe/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        }
      });
      console.log(response.data);
      navigate('/myrecipes');
    } catch (error) {
      console.error('Error submitting recipe:', error);
      setError('Error submitting recipe. Please try again later.');
    }
  };

  // const getSuggestions = (value) => {
  //   const inputValue = value.trim().toLowerCase();
  //   const inputLength = inputValue.length;
  //   return inputLength === 0 ? [] : ingredients.filter(ing =>
  //     ing.toLowerCase().slice(0, inputLength) === inputValue
  //   );
  // };

  // const onSuggestionsFetchRequested = ({ value }) => {
  //   setSuggestions(getSuggestions(value));
  // };

  // const onSuggestionsClearRequested = () => {
  //   setSuggestions([]);
  // };

  const onIngredientInputChange = (index) => (event, value) => {
    const newIngredientParts = [...recipe.RecipeIngredientParts];
    newIngredientParts[index] = value;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      RecipeIngredientParts: newIngredientParts,
    }));
  };

  const StyledPaper = styled(Paper)(({ theme }) => ({
    '& .MuiAutocomplete-listbox': {
      display: 'block',
    },
  }));

  const totalTime = () => {
    const prepHours = parseInt(recipe.PrepTime.substring(2, recipe.PrepTime.indexOf('H')), 10);
    const prepMinutes = parseInt(recipe.PrepTime.substring(recipe.PrepTime.indexOf('H') + 1, recipe.PrepTime.indexOf('M')), 10);
    const cookHours = parseInt(recipe.CookTime.substring(2, recipe.CookTime.indexOf('H')), 10);
    const cookMinutes = parseInt(recipe.CookTime.substring(recipe.CookTime.indexOf('H') + 1, recipe.CookTime.indexOf('M')), 10);
    const totalHours = prepHours + cookHours;
    const totalMinutes = prepMinutes + cookMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `PT${totalHours + hours}H${minutes}M`;
  };

  return (
    <div className="add-recipe-form">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <br /><br /><br /><br /><br /><br />
        <h1>Add a Recipe</h1>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          name="Name"
          placeholder="Recipe Name"
          value={recipe.Name}
          onChange={handleChange}
        />
        <div>
          <h2>Preparation Time</h2>
          <div className="time-dropdowns">
            <select name="PrepHours" value={recipe.PrepHours} onChange={handleChange}>
              {[...Array(24).keys()].map((i) => (
                <option key={i} value={`${i}`}>{i} hours</option>
              ))}
            </select>
            <select name="PrepMinutes" value={recipe.PrepMinutes} onChange={handleChange}>
              {[15, 30, 45, 60].map((i) => (
                <option key={i} value={`${i}`}>{i} minutes</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <h2>Cooking Time</h2>
          <div className="time-dropdowns">
            <select name="CookHours" value={recipe.CookHours} onChange={handleChange}>
              {[...Array(24).keys()].map((i) => (
                <option key={i} value={`${i}`}>{i} hours</option>
              ))}
            </select>
            <select name="CookMinutes" value={recipe.CookMinutes} onChange={handleChange}>
              {[15, 30, 45, 60].map((i) => (
                <option key={i} value={`${i}`}>{i} minutes</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <h2>Total Time</h2>
          <p>{totalTime()}</p>
        </div>
        <div>
          <h2>Ingredients</h2>
          {recipe.RecipeIngredientParts.map((ingredient, index) => (
            <div key={index} className="ingredient">
              <Autocomplete
                disablePortal
                value={ingredient}
                onChange={(event, newValue) => handleIngredientNameChange(index, newValue)}
                freeSolo
                inputValue={ingredient}
                onInputChange={onIngredientInputChange(index)}
                options={ingredients}
                PaperComponent={StyledPaper}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add specific ingredient"
                    variant="outlined"
                    fullWidth
                    style={{ width: 300 }} // Adjust width here
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
          <button type="button" className="add-more" onClick={handleAddIngredient}>Add More</button>
        </div>
        <div>
          <h2>Method</h2>
          {recipe.RecipeInstructions.map((step, index) => (
            <div key={index} className="method">
              <input
                type="text"
                placeholder="Procedure Step"
                value={step}
                onChange={(e) => handleMethodChange(index, e)}
              />
            </div>
          ))}
          <button type="button" className="add-more" onClick={handleAddMethod}>Add More</button>
        </div>
        <div>
          <h2>Nutritional Information</h2>
          <input
            type="text"
            name="Calories"
            placeholder="Calories"
            value={recipe.Calories}
            onChange={handleChange}
          />
          <input
            type="text"
            name="FatContent"
            placeholder="Fat Content"
            value={recipe.FatContent}
            onChange={handleChange}
          />
          <input
            type="text"
            name="CarbohydrateContent"
            placeholder="Carbohydrate Content"
            value={recipe.CarbohydrateContent}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ProteinContent"
            placeholder="Protein Content"
            value={recipe.ProteinContent}
            onChange={handleChange}
          />
        </div>
        <div>
          <h2>Final Image</h2>
          <input type="file" onChange={handleImageChange} />
        </div>
        <div>
          <input
            type="text"
            name="Description"
            placeholder="Description"
            value={recipe.Description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ImageURLs"
            placeholder="Image URLs"
            value={recipe.ImageURLs}
            onChange={handleChange}
          />
          <input
            type="text"
            name="RecipeCategory"
            placeholder="Recipe Category"
            value={recipe.RecipeCategory}
            onChange={handleChange}
          />
          <input
            type="text"
            name="Keywords"
            placeholder="Keywords"
            value={recipe.Keywords}
            onChange={handleChange}
          />
          <input
            type="text"
            name="RecipeYield"
            placeholder="Recipe Yield"
            value={recipe.RecipeYield}
            onChange={handleChange}
          />
          <input
            type="text"
            name="RecipeServings"
            placeholder="Recipe Servings"
            value={recipe.RecipeServings}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;

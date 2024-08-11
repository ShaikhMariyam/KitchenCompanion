import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import BarCookie from '../../assets/Bar-Cookie.jpg';
import Beverages from '../../assets/Beverages.jpg';
import Breads from '../../assets/Breads.jpg';
import Breakfast from '../../assets/Breakfast.jpg';
import Candy from '../../assets/Candy.jpg';
import Cheese from '../../assets/Cheese.jpg';
import ChickenBreast from '../../assets/Chicken-Breast.jpg';
import Chicken from '../../assets/Chicken.jpg';
import DessertImage from '../../assets/Dessert.jpg';
import DropCookies from '../../assets/Drop-Cookies.jpg';
import LunchSnacks from '../../assets/Lunch-Snacks.jpg';
import Meat from '../../assets/Meat.jpg';
import OneDishMeal from '../../assets/One-Dish-Meal.jpeg';
import Pie from '../../assets/Pie.jpg';
import Pork from '../../assets/Pork.jpg';
import Potato from '../../assets/Potato.jpg';
import QuickBreads from '../../assets/Quick-Breads.jpg';
import Sauces from '../../assets/Sauces.jpg';
import Vegetable from '../../assets/Vegetable.jpg';
import YeastBread from '../../assets/Yeast-Bread.jpeg';
import './UserDashboard.css';

const UserDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(nextImage, 5000); // Change image every 5 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [currentImageIndex]);


  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const categoryImages = {
    'Bar Cookie': BarCookie,
    'Beverages': Beverages,
    'Breads': Breads,
    'Breakfast': Breakfast,
    'Candy': Candy,
    'Cheese': Cheese,
    'Chicken Breast': ChickenBreast,
    'Chicken': Chicken,
    'Dessert': DessertImage,
    'Drop Cookies': DropCookies,
    'Lunch/Snacks': LunchSnacks,
    'Meat': Meat,
    'One Dish Meal': OneDishMeal,
    'Pie': Pie,
    'Pork': Pork,
    'Potato': Potato,
    'Quick Breads': QuickBreads,
    'Sauces': Sauces,
    'Vegetable': Vegetable,
    'Yeast Breads': YeastBread
  };

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/recipe');
        const allRecipes = response.data.results;
        const randomRecipes = shuffleArray(allRecipes).slice(0, 20);
        const urls = randomRecipes.map(recipe => {
          const firstImageUrl = recipe.ImageURLs.match(/"(.*?)"/);
          return firstImageUrl && firstImageUrl.length > 1 ? firstImageUrl[1].replace(/"/g, '') : null;
        });
        setImageUrls(urls.filter(url => url !== null));
        setRecipes(randomRecipes);
      } catch (error) {
        console.log('Error fetching random recipes:', error);
      }
    };

    const fetchPopularCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/categories');
        setCategories(response.data.slice(0, 20));
        console.log(categories);
      } catch (error) {
        console.log('Error fetching popular categories:', error);
      }
    };

    const fetchPopularRecipes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/get_top_rated_recipes');
        const popularRecipesdata = response.data.slice(0, 20);
        const processedRecipes = popularRecipesdata.map(recipe => {
          const firstImageUrl = recipe.ImageURLs.match(/"(.*?)"/);
          const imageUrl = firstImageUrl && firstImageUrl.length > 1 ? firstImageUrl[1].replace(/"/g, '') : null;
          return { ...recipe, imageUrl };  // Add processed imageUrl to recipe object
        });
        setPopularRecipes(processedRecipes);

        console.log(categories);
      } catch (error) {
        console.log('Error fetching popular categories:', error);
      }
    };

    fetchRandomRecipes();
    fetchPopularCategories();
    fetchPopularRecipes();
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  };

  const handleImageClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="Food">
      <div className="image-slider">
        <button onClick={prevImage} className="slider-button left-button">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="image-container">
          <a onClick={() => handleImageClick(recipes[currentImageIndex]?.id)}>
            <img src={imageUrls[currentImageIndex]} alt="Slider" />
            <div className="image-name">{recipes[currentImageIndex]?.Name}</div>
          </a>
        </div>
        <button onClick={nextImage} className="slider-button right-button">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className="popular-container">
        <h2>Popular Categories</h2>
        <div className="category-container">
          <div className="category-list">
            {categories.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-circle" onClick={() => handleCategoryClick(category)}>
                  <img src={categoryImages[category]} alt={category} className="category-image" />
                </div>
                <div className="category-label">
                  {category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="popular-recipes">
        <br /> <br /> <br /> <br /> <br />
        <h2>Popular Recipes</h2>
        <div className="recipe-grid">
          {popularRecipes.map((recipe, index) => (
            <a key={index} onClick={() => handleImageClick(recipe.id)} className="recipe-card">
              <div className="recipe-image">
                <img src={recipe.imageUrl} alt={recipe.Name} />
              </div>
              <div className="recipe-details">
                <h3 className="recipe-name">{recipe.Name}</h3>
                <p className="recipe-category">{recipe.RecipeCategory}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
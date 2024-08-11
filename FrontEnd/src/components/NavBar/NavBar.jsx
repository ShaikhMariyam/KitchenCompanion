/*eslint-disable*/
import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Handsome from "../../assets/profile.jpg";
import Link from '@mui/material/Link';
import { CiSearch } from "react-icons/ci";
import "./NavBar.css";

const Navbar = (props) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchIconClick = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted with query:', searchQuery);
    navigate(`/search/${searchQuery}`);

    setSearchQuery('');
    setSearchVisible(false);
  };

  const handleMyRecipesClick = () => {
    navigate('/MyRecipes');
  };

  const handleProfileIconClick = () => {
    navigate('/profile');
  };

  const handleFavoritesClick = () => {
    navigate('/Favorites');
  };

  const handleLogoClick = () => {
    navigate('/'); // Navigate to home page
  };

  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="image">
        <img className="death" src={logo} onClick={handleLogoClick} />
      </div>
      <div className="List">
        <nav>
          <ul>
            <li>
              <a href="" onClick={handleMyRecipesClick}>My Recipes</a>
            </li>
            <li>
              <a href="" onClick={handleFavoritesClick}>Favourites</a>
            </li>
            <li>
              <a href="#">Categories</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="Rightside">
        {searchVisible && (
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Enter search query"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button type="submit">Search</button>
          </form>
        )}
        <a className="form" onClick={handleSearchIconClick}>
          <CiSearch className="icon" />
        </a>
        <a className="form" onClick={handleProfileIconClick}>
          <img className="normal" src={Handsome} />
        </a>
      </div>
    </div>
  );
};

export default Navbar;

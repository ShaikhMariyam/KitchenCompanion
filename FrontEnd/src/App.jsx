import './App.css'
import { Routes, Route, Router } from 'react-router-dom'
import UserDashboard from './components/UserDashboard/UserDashboard'
import NavBar from './components/NavBar/NavBar'
import AddRecipe from './components/AddRecipe/AddRecipe'
import ViewRecipe from './components/ViewRecipe/ViewRecipe'
import LoginForm from './components/Login/Login'
import Register from './components/Register/Register'
import SearchRecipe from './components/SearchRecipe/SearchRecipe'
import SearchIngredients from './components/SearchRecipe/SearchIngredients'
import RecipeDetails from './components/ViewRecipe/RecipeDetails'
import Category from './components/Categories/CategoryView'
import ProtectedRoute from './context/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import Profile from './components/UserProfile/UserProfile'
import MyRecipes from './components/MyRecipes/MyRecipes'
import UpdateRecipe from './components/UpdateRecipe/UpdateRecipe'
import Favourites from './components/Favourites/Favourites'
import AdminDashboard from './components/AdminDashboard/AdminDashboard'
import AddAdminForm from './components/AddAdmin/AddAdmin'
import AdminReport from './components/AdminReport/AdminReport'

function App() {
  return (
    <>
      <NavBar />
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddRecipe />
              </ProtectedRoute>
            } />
          <Route
            path="/update/:recipeId"
            element={
              <ProtectedRoute>
                <UpdateRecipe />
              </ProtectedRoute>
            } />
          <Route
            path="/myrecipes"
            element={
              <ProtectedRoute>
                <MyRecipes />
              </ProtectedRoute>
            } />
          <Route
            path="/Favorites"
            element={
              <ProtectedRoute>
                <Favourites />
              </ProtectedRoute>
            } />
          <Route
            path="/AdminDashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

          <Route path="/login" element={<LoginForm />} />
          <Route path="/AddAdminForm" element={<AddAdminForm />} />
          <Route path="/AdminReport" element={<AdminReport />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path='/view' element={<ViewRecipe />} />
          <Route path='/search/:query' element={<SearchRecipe />} />
          <Route path='/ingredients' element={<SearchIngredients />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/category/:category" element={<Category />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App

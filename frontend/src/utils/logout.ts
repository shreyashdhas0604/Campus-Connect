function logout() {
  // Clear tokens from local storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  // Redirect to login page
  window.location.href = '/login';
}

export default logout;
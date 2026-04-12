  const isLoggedIn = localStorage.getItem('is_admin') !== null;
    const authLink = document.getElementById('authLink');
    const applicationsLink = document.getElementById('applicationsLink');
   


   if (isLoggedIn) {
    authLink.innerHTML = '<a href="#" onclick="localStorage.clear(); window.location.href=\'Index.html\'">Logout</a>';
    applicationsLink.innerHTML = '<a href="AppliedJobs.html">My Applications</a> | ';


} else {
    authLink.innerHTML = '<a href="LogIn.html">Sign in</a>';
    applicationsLink.innerHTML = '';
  
   
}
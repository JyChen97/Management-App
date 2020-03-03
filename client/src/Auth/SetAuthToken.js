import axios from 'axios';

const setAuthToken = () => {
  let token = sessionStorage.getItem('idToken')

  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

export default setAuthToken;
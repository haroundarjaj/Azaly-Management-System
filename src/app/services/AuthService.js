import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const AuthUrl = `${REACT_APP_API_URL}/api/auth`

class AuthService {
    login = (credentials) => axios.post(`${AuthUrl}/signin`, credentials, { headers });

    signup = (data) => axios.post(`${AuthUrl}/signup`, data, { headers });
}
export default new AuthService();
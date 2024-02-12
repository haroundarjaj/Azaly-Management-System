import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const userAPI = `${REACT_APP_API_URL}/api/user`

class UserService {
    update = (user) => axios.put(`${userAPI}/update`, user, { headers });

    getAll = () => axios.get(`${userAPI}/all`, { headers });

    getUserInfo = (id) => axios.get(`${userAPI}/user-info/${id}`, { headers });

    delete = (id) => axios.delete(`${userAPI}/delete/${id}`, { headers });

    getUserByApprovalState = (state) => axios.get(`${userAPI}/approval-state/${state}`, { headers })

    approveUser = (id) => axios.put(`${userAPI}/approve/${id}`, { headers });

    activateUser = (id) => axios.put(`${userAPI}/activate/${id}`, { headers });

    deactivateUser = (id) => axios.put(`${userAPI}/deactivate/${id}`, { headers });
}
export default new UserService();
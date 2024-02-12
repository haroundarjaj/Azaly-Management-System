import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const roleAPI = `${REACT_APP_API_URL}/api/role`

class RoleService {

    add = (role) => axios.post(`${roleAPI}/add`, role, { headers });

    update = (role) => axios.put(`${roleAPI}/update`, role, { headers });

    getAll = () => axios.get(`${roleAPI}/all`, { headers });

    delete = (id) => axios.delete(`${roleAPI}/delete/${id}`, { headers });

    verifyRoleNotRelated = (id) => axios.get(`${roleAPI}/verify/${id}`, { headers });

}
export default new RoleService();
import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const permissionAPI = `${REACT_APP_API_URL}/api/permission`

class PermissionService {

    getAll = () => axios.get(`${permissionAPI}/all`, { headers });

}
export default new PermissionService();
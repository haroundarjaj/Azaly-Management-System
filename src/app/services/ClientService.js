import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const clientAPI = `${REACT_APP_API_URL}/api/client`

class ClientService {
    add = (client) => axios.post(`${clientAPI}/add`, client, { headers });

    update = (client) => axios.put(`${clientAPI}/update`, client, { headers });

    getAll = () => axios.get(`${clientAPI}/all`, { headers });

    delete = (id) => axios.delete(`${clientAPI}/delete/${id}`, { headers });

}
export default new ClientService();
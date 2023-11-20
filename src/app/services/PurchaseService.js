import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const purchaseAPI = `${REACT_APP_API_URL}/api/purchase`

class PurchaseService {
    add = (purchase) => axios.post(`${purchaseAPI}/add`, purchase, { headers });

    update = (purchase) => axios.put(`${purchaseAPI}/update`, purchase, { headers });

    updateState = (state, purchaseId) => axios.put(`${purchaseAPI}/update-state/${state}/${purchaseId}`, { headers });

    getAll = () => axios.get(`${purchaseAPI}/all`, { headers });

    delete = (id) => axios.delete(`${purchaseAPI}/delete/${id}`, { headers });

}
export default new PurchaseService();
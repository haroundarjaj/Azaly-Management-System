import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const orderAPI = `${REACT_APP_API_URL}/api/order`

class OrderService {
    add = (order) => axios.post(`${orderAPI}/add`, order, { headers });

    update = (order) => axios.put(`${orderAPI}/update`, order, { headers });

    updateState = (state, orderId) => axios.put(`${orderAPI}/update-state/${state}/${orderId}`, { headers });

    getAll = () => axios.get(`${orderAPI}/all`, { headers });

    delete = (id) => axios.delete(`${orderAPI}/delete/${id}`, { headers });

}
export default new OrderService();
import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const productAPI = `${REACT_APP_API_URL}/api/product`

class ProductService {
    add = (product) => axios.post(`${productAPI}/add`, product, { headers });

    update = (product) => axios.put(`${productAPI}/update`, product, { headers });

    getAll = () => axios.get(`${productAPI}/all`, { headers });

    delete = (id) => axios.delete(`${productAPI}/delete/${id}`, { headers });

}
export default new ProductService();
import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const categoryAPI = `${REACT_APP_API_URL}/api/product/category`

class CategoryService {
    add = (category) => axios.post(`${categoryAPI}/add`, category, { headers });

    update = (category) => axios.put(`${categoryAPI}/update`, category, { headers });

    getAll = () => axios.get(`${categoryAPI}/all`, { headers });

    getAllWithoutImage = () => axios.get(`${categoryAPI}/all/no-image`, { headers });

    delete = (id) => axios.delete(`${categoryAPI}/delete/${id}`, { headers });

}
export default new CategoryService();
import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const supplierAPI = `${REACT_APP_API_URL}/api/supplier`

class SupplierService {
    add = (supplier) => axios.post(`${supplierAPI}/add`, supplier, { headers });

    update = (supplier) => axios.put(`${supplierAPI}/update`, supplier, { headers });

    getAll = () => axios.get(`${supplierAPI}/all`, { headers });

    delete = (id) => axios.delete(`${supplierAPI}/delete/${id}`, { headers });

}
export default new SupplierService();
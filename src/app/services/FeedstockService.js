import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
let headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "http://localhost:9000/",
    "Access-Control-Allow-Methods": "*"
};

const feedstockAPI = `${REACT_APP_API_URL}/api/feedstock`

class FeedstockService {
    add = (feedstock) => axios.post(`${feedstockAPI}/add`, feedstock, { headers });

    update = (feedstock) => axios.put(`${feedstockAPI}/update`, feedstock, { headers });

    getAll = () => axios.get(`${feedstockAPI}/all`, { headers });

    delete = (id) => axios.delete(`${feedstockAPI}/delete/${id}`, { headers });

}
export default new FeedstockService();
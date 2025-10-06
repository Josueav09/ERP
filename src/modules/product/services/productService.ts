import api from '../../../services/api';

export const fetchProducts = async () => {
  const res = await api.get('/product');
  return res.data;
};

export default { fetchProducts };

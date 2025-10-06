import api from '../../../services/api';

export const fetchMarketing = async () => {
  const res = await api.get('/marketing');
  return res.data;
};

export default { fetchMarketing };

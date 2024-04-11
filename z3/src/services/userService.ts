import axios from 'axios';
import { User, EditUser } from '@/types/user';
import { Search } from '@/types/search';
const token = '6c3734ea285757e135f86bdedca0aaa893503f62329bb1ae8d1c95ddaef7e698';

export default {
  async getUsers(filters: Search) {
    let url = `https://gorest.co.in/public/v2/users?`;

    if (filters.name) url += `&name=${filters.name}`;
    if (filters.email) url += `&email=${filters.email}`;
    if (filters.gender) url += `&gender=${filters.gender}`;
    if (filters.status) url += `&status=${filters.status}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },  
  async addUser(data: User) {
    const response = await axios.post('https://gorest.co.in/public/v2/users', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  async updateUser(id: number, data: EditUser) {
    const response = await axios.patch(`https://gorest.co.in/public/v2/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  async deleteUser(id: number) {
    const response = await axios.delete(`https://gorest.co.in/public/v2/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}

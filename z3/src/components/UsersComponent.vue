<template>
  <div id="app">
    <div class="search-section">
      <input v-model="searchByName" placeholder="Search users by name" class="search-input" />
      <input v-model="searchByEmail" placeholder="Search users by email" class="search-input" />
      <input v-model="searchByGender" placeholder="Search users by gender" class="search-input" />
      <input v-model="searchByStatus" placeholder="Search users by status" class="search-input" />
      <button @click="fetchUsers" class="button search-button">Search</button>
    </div>
    <div class="add-user-section">
      <input v-model="newUser.name" placeholder="Name" class="input" />
      <input v-model="newUser.email" placeholder="Email" class="input" />
      <input v-model="newUser.gender" placeholder="Gender" class="input" />
      <input v-model="newUser.status" placeholder="Status" class="input" />
      <button @click="addUser" class="button">Add User</button>
    </div>
    <div v-if="isLoading" class="loading-spinner"></div>
    <table v-else>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header.value">{{ header.text }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td v-for="header in headers" :key="header.value">
            <template v-if="header.value !== 'actions'">
              <span v-if="!user.isEditing">{{ user[header.value] }}</span>
              <input v-else v-model="user[header.value]" class="input" />
            </template>
            <template v-else>
              <button v-if="!user.isEditing" @click="toggleEdit(user)" class="button edit-button">Edit</button>
              <button v-else @click="saveEdit(user)" class="button save-button">Save</button>
              <button @click="deleteUser(user)" class="button delete-button">Delete</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import userService from '@/services/userService';

export default {
  setup() {
    const users = ref([]);
    const searchByName = ref('');
    const isLoading = ref(false);
    const searchByEmail = ref('');
    const searchByGender = ref('');
    const searchByStatus = ref('');
    const headers = [
      { text: 'Name', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Gender', value: 'gender' },
      { text: 'Status', value: 'status' },
      { text: 'Actions', value: 'actions'},
    ];
    const newUser = ref({
      name: '',
      email: '',
      gender: '',
      status: ''
    });

    const fetchUsers = async () => {
      isLoading.value = true;
      users.value = await userService.getUsers({
        name: searchByName.value,
        email: searchByEmail.value,
        gender: searchByGender.value,
        status: searchByStatus.value
      });
      isLoading.value = false;
    };

    const addUser = async () => {
      try {
        await userService.addUser(newUser.value);
        newUser.value = {
          name: '',
          email: '',
          gender: '',
          status: ''
        };
        await fetchUsers();
      } catch (error) {
        handleRequestError(error, 'There was an error adding the user.');
      }
    };

    const toggleEdit = (user) => {
      user.isEditing = true;
      user.initialData = { ...user };
    };

    const saveEdit = async (user) => {
      try {
        delete user.isEditing;
        await userService.updateUser(user.id, user);
        await fetchUsers();
      } catch (error) {
        handleRequestError(error, 'There was an error updating the user.');
        await fetchUsers();
      }
};
    const deleteUser = async (user) => {
      try {
        await userService.deleteUser(user.id);
        await fetchUsers();
        alert('User has been successfully deleted.');
      } catch (error) {
        handleRequestError(error, 'There was an error deleting the user.');
      }
    };

    const handleRequestError = (error, defaultMessage) => {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        let errorMessage = defaultMessage + '\n';
        for (const error of errors) {
          errorMessage += `- ${error.field}: ${error.message}\n`;
        }
        alert(errorMessage);
      } else {
        alert(defaultMessage + ' Please try again later.');
      }
    };

    onMounted(fetchUsers);

    return { users, searchByEmail, searchByGender, searchByName, searchByStatus, fetchUsers, addUser, deleteUser, headers, newUser, toggleEdit, saveEdit };
  }
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input {
  margin: 10px;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-section,
.add-user-section {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-input {
  margin-right: 10px;
}

.button {
  margin: 10px;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button {
  background-color: #4CAF50;
  color: white;
}

.edit-button {
  background-color: #008CBA;
  color: white;
}

.save-button {
  background-color: #4CAF50;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

table {
  width: 80%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead {
  background-color: #f2f2f2;
}

th, td {
  padding: 10px;
  text-align: left;
}

th {
  font-weight: bold;
}

.loading-spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin-top: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

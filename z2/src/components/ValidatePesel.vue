<template>
  <div class="centered-container">
    <input v-model="pesel" placeholder="Enter PESEL number" />
    <button @click="validatePesel(pesel)">Validate</button>
    <p>{{ result }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pesel = ref<string>("")
const result = ref<string>("")

const validatePesel = (peselValue: string): boolean => {
  if (peselValue.length !== 11) {
    result.value = "PESEL number must have 11 digits";
    return false;
  }

  if (!/^\d+$/.test(peselValue)) {
    result.value = "PESEL number must contain only digits";
    return false;
  }

  const year = parseInt(peselValue.substring(0, 2));
  const monthCode = parseInt(peselValue.substring(2, 4));
  const day = parseInt(peselValue.substring(4, 6));

  let month = 0;
  if (monthCode >= 81 && monthCode <= 92) { // 1800-1899
    month = monthCode - 80;
  } else if (monthCode >= 1 && monthCode <= 12) { // 1900-1999
    month = monthCode;
  } else if (monthCode >= 21 && monthCode <= 32) { // 2000-2099
    month = monthCode - 20;
  } else if (monthCode >= 41 && monthCode <= 52) { // 2100-2199
    month = monthCode - 40;
  } else if (monthCode >= 61 && monthCode <= 72) { // 2200-2299
    month = monthCode - 60;
  } else {
    result.value = "Invalid month code in PESEL number";
    return false;
  }

  const currentYear = new Date().getFullYear() % 100;
  if (year > currentYear) {
    result.value = "PESEL birth year is in the future";
    return false;
  }

  const birthDate = new Date(year + 1900, month - 1, day);
  if (birthDate > new Date()) {
    result.value = "PESEL birth date is in the future";
    return false;
  }

  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(peselValue[i]) * weights[i];
  }
  const checksum = (10 - (sum % 10)) % 10;
  if (checksum !== parseInt(peselValue[10])) {
    result.value = "Incorrect checksum in PESEL number";
    return false;
  }

  result.value = "PESEL number is correct";
  return true;
};


</script>

<style scoped>
.centered-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 30%;
  margin-right: auto;
  margin-left: auto;
  border: 1px solid black;
  border-radius: 5px;
}

input {
  margin: 10px;
  padding: 5px;
}

button {
  padding: 5px;
}

p {
  margin: 10px;
}
</style>

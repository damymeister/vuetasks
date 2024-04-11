<template>
  <div class="container">
    <input type="file" @change="handleFileUpload" accept=".txt" />
    <div v-if="uploadedText" class="output">
      <h2>Processed text:</h2>
      <pre>{{ processedText }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const uploadedText = ref('');
const processedText = ref('');

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const text = reader.result;
    uploadedText.value = text;
    processText();
  };

  reader.readAsText(file);
};

const processText = () => {
  const text = uploadedText.value;
  if (!text) return;

  const wordsRegex = /[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu;
  const words = text.match(wordsRegex);

  let processed = '';

  words.forEach(word => {
    if (word.match(/[\p{L}\p{N}]/gu)) {
      const processedWord = processWord(word);
      processed += processedWord;
    } else {
      processed += word;
    }
  });

  processedText.value = processed;
};

const processWord = (word) => {
  const firstChar = word[0];
  const firstCharUpperCase = firstChar.toUpperCase();
  const isFirstCharUpperCase = firstChar === firstCharUpperCase;

  if (word.length <= 2) {
    return word;
  }

  const lastChar = word[word.length - 1];
  const middle = word.substring(1, word.length - 1);
  const shuffledMiddle = shuffleString(middle);

  const firstCharProcessed = isFirstCharUpperCase ? firstCharUpperCase : firstChar.toLowerCase();

  return `${firstCharProcessed}${shuffledMiddle}${lastChar}`;
};

const shuffleString = (str) => {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
};

</script>

<style scoped>
.container {
  margin: 20px;
}

.output {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>

<template>
  <button ref="randomWordButton" class="wordButton1" @click="getRandomWord();useRandomButtonClass()">Random word is: {{ word }}</button>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

// reactive state
const word = ref("")
const buttonClass = ref("")
const randomWords = ["patata","jamon","lechuga"]
const randomButtonClasses = ["wordButton1","wordButton2","wordButton3"]
const randomButton = useTemplateRef('randomWordButton')

// functions that mutate state and trigger updates
function getRandomWord() {
  word.value = randomWords[Math.floor(Math.random() * 3)]
}

function useRandomButtonClass() {
  randomButton.value.removeAttribute('class')
  buttonClass.value = randomButtonClasses[Math.floor(Math.random() * 3)]
  randomButton.value.setAttribute('class', buttonClass.value)
}
</script>


<style scoped lang="scss" src="./RandomButtonTest.scss" />
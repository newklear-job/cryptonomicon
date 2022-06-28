<template>
  Please enter "{{ $options.CONTROL_PHRASE }}"
  <input
      v-model="controlPhrase"
      type="text"
  />
  <button
      type="submit"
      :disabled="!controlPhraseIsCorrect"
      @click="closeCallback"
      class="bg-blue-600 text-white px-2 py-1 text-sm uppercase tracking-wide font-bold rounded-lg"
  >
    Ok
  </button>
</template>
<script>
export default {
  props: {
    closeCallback: {
      type: Function,
      required: true
    }
  },
  emits: {
    close: null,
  },
  CONTROL_PHRASE: "I Understand",
  data () {
    return {
      controlPhrase: ''
    }
  },
  computed: {
    controlPhraseIsCorrect (){
      return this.controlPhrase === this.$options.CONTROL_PHRASE;
    }
  }
};
</script>

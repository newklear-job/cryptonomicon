<template>
  <button
      type="submit"
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
};
</script>

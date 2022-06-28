<template>
  <div
      v-if="isOpened"
      class="fixed inset-0 w-full h-screen flex items-center justify-center bg-semi-75"
  >
    <div class="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
      <button
          type="submit"
          @click="close"
          class="bg-blue-600 text-white px-2 py-1 text-sm uppercase tracking-wide font-bold rounded-lg"
      >Close from modal
      </button>
      <section id="content">
        <slot name="content"></slot>
      </section>
      <br>
      <section id="controls">
        <slot name="controls" :closeCallback="close"></slot>
      </section>

    </div>
  </div>
</template>
<script>
export default {
  props: {
    isOpened: {
      type: Boolean,
      required: true,
    }
  },
  emits: {
    'close': null
  },
  methods: {
    reportClosing () {
      console.log('Popup was closed.')
    },
    close () {
      this.$emit('close')
      this.reportClosing()
    }
  }
};
</script>

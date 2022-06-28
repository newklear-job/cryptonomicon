<template>
  <button
      class="bg-blue-600 text-white px-4 py-2 text-sm uppercase tracking-wide font-bold rounded-lg"
      @click="isOpenedSubmit = true"
  >
    Show Submit Modal
  </button>

  <button
      class="bg-blue-600 text-white px-4 py-2 text-sm uppercase tracking-wide font-bold rounded-lg"
      @click="isOpenedDanger = true"
  >
    Show Danger Modal
  </button>

  <the-modal :isOpened="isOpenedSubmit" @close="isOpenedSubmit=false">
    <template #content> Modal content</template>

    <template #controls="slotProps">
      <modal-controls-submit :closeCallback="slotProps.closeCallback"/>
    </template>
  </the-modal>

  <the-modal :isOpened="isOpenedDanger" @close="isOpenedDanger=false">
    <template #content> Modal content</template>

    <template #controls="slotProps">
      <modal-controls-danger :closeCallback="slotProps.closeCallback"/>
    </template>
  </the-modal>

</template>
<script>
import TheModal from "./Modal.vue";
import ModalControlsSubmit from "./ModalControlsSubmit.vue";
import ModalControlsDanger from "./ModalControlsDanger.vue";

export default {
  components: {
    TheModal,
    ModalControlsSubmit,
    ModalControlsDanger,
  },
  data() {
    return {
      isOpenedSubmit: false,
      isOpenedDanger: false,
    }
  }
};
</script>

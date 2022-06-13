<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
              v-model="ticker"
              @keydown.enter="add"
              type="text"
              name="wallet"
              id="wallet"
              class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="Например DOGE"
          />
        </div>
        <div v-if="tickerSuggestions.length" class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
            <span v-for="suggestion in tickerSuggestions"
                  :key="suggestion"
                  @click="tickerSuggestionClicked(suggestion)"
                  class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              {{ suggestion }}
            </span>

        </div>

        <div v-if="tickerAlreadySelected" class="text-sm text-red-600">Такой тикер уже добавлен</div>

      </div>
    </div>
    <add-button @click="add" type="button" :disabled="disabled" class="my-4"/>
  </section>
</template>
<script>
import AddButton from "./AddButton.vue";

export default {
  components: {
    AddButton
  },

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    coinList: {
      type: Array,
      required: true,
    },
    tickerAlreadySelected: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  emits: {
    "add-ticker": value => typeof value === "string" && value.length > 0,
    "ticker-select-changed": value => typeof value === "string",
  },

  data() {
    return {
      ticker: "",

      tickerSuggestions: [],
    };
  },

  methods: {
    add() {
      if (this.ticker.length === 0) {
        return;
      }
      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },
    tickerSuggestionClicked(suggestion) {
      this.ticker = suggestion
      this.add()
    },
  },
  computed: {
    tickerUpperCase() {
      return this.ticker.toUpperCase();
    }
  },
  watch: {
    ticker() {
      this.$emit("ticker-select-changed", this.ticker);
      if (this.ticker.length === 0) {
        this.tickerSuggestions = []
        return;
      }
      const suggestions = this.coinList.filter(coin =>
          coin.Symbol.toUpperCase().includes(this.tickerUpperCase) ||
          coin.FullName.toUpperCase().includes(this.tickerUpperCase))

      this.tickerSuggestions = suggestions.slice(0, 4).map(t => t.Symbol)
    }
  }
};
</script>

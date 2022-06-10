const API_KEY =
  "380ec498044c900f249ad39326e8320a2cb4ee09b94afe4dff6911e37ef56bfc";

const tickersHandlers = new Map(); // {}
// CXC coin uses double conversion atm.
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";
const INVALID_TICKER = "500";
const INVALID_TICKER_MESSAGE = "INVALID_SUB";
const BTC_CURRENCY = "BTC";
const USD_CURRENCY = "USD";

let btcToUsdPrice = null;


//todo: implement correct unsubscribe with double conversion model.
socket.addEventListener("message", e => {
    const {
      TYPE: type,
      FROMSYMBOL: fromCurrency,
      TOSYMBOL: toCurrency,
      PRICE: newPrice,
      PARAMETER: invalidTickerParameter,
      MESSAGE: message
    } = JSON.parse(
      e.data
    );

    if (type === INVALID_TICKER && message === INVALID_TICKER_MESSAGE) {
      let [, , fromCurrency, toCurrency] = invalidTickerParameter.split('~');
      handleDoubleConversion(fromCurrency, toCurrency)
    }

    if (type !== AGGREGATE_INDEX || newPrice === undefined) {
      return;
    }

    if (fromCurrency === BTC_CURRENCY && toCurrency === USD_CURRENCY) {
      btcToUsdPrice = newPrice;
    }

    let price = newPrice;
    if (toCurrency === BTC_CURRENCY) {
      price = newPrice * btcToUsdPrice;
    }

    const handlers = tickersHandlers.get(fromCurrency) ?? [];
    handlers.forEach(fn => fn(price));
  }
);

function handleDoubleConversion(fromCurrency, toCurrency) {
  if (toCurrency === BTC_CURRENCY)
    return;
  if (!tickersHandlers.has(BTC_CURRENCY)) {
    subscribeToTicker(BTC_CURRENCY, () => {
    })
  }
  subscribeToTickerOnWs(fromCurrency, BTC_CURRENCY)
}

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    {once: true}
  );
}

function subscribeToTickerOnWs(ticker, conversionCurrency = USD_CURRENCY) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~${conversionCurrency}`]
  });
}

function unsubscribeFromTickerOnWs(ticker, conversionCurrency = USD_CURRENCY) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~${conversionCurrency}`]
  });
}

export const subscribeToTicker = (ticker, cb) => {
  ticker = ticker.toUpperCase()
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = ticker => {
  ticker = ticker.toUpperCase()
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};
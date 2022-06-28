const API_KEY =
  "380ec498044c900f249ad39326e8320a2cb4ee09b94afe4dff6911e37ef56bfc1";

const tickersHandlers = new Map(); // {}
const doubleConvertedTickers = [];

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

socket.addEventListener("message", e => {
    const parsedMessage = JSON.parse(
      e.data
    );
    const {TYPE: type} = parsedMessage;

    if (type === INVALID_TICKER) {
      handleDoubleConversionMessageOnWs(parsedMessage)
    }

    if (type === AGGREGATE_INDEX) {
      handlePriceUpdateMessageOnWs(parsedMessage)
    }
  }
);

function handlePriceUpdateMessageOnWs(wsMessage) {
  const {
    FROMSYMBOL: fromCurrency,
    TOSYMBOL: toCurrency,
    PRICE: price,
  } = wsMessage;

  if (price === undefined) {
    return;
  }

  if (fromCurrency === BTC_CURRENCY && toCurrency === USD_CURRENCY) {
    btcToUsdPrice = price;
  }

  let newPrice = price;
  if (toCurrency === BTC_CURRENCY) {
    newPrice = price * btcToUsdPrice;
  }

  const handlers = tickersHandlers.get(fromCurrency) ?? [];
  handlers.forEach(fn => fn(newPrice));
}


function handleDoubleConversionMessageOnWs(wsMessage) {
  const {
    PARAMETER: invalidTickerParameter,
    MESSAGE: message
  } = wsMessage;

  if (message !== INVALID_TICKER_MESSAGE) {
    return;
  }

  const [, , fromCurrency, toCurrency] = invalidTickerParameter.split('~');
  if (toCurrency === BTC_CURRENCY) {
    return;
  }

  if (!tickersHandlers.has(BTC_CURRENCY)) {
    subscribeToTicker(BTC_CURRENCY, () => {
    })
  }
  subscribeToTickerOnWs(fromCurrency, BTC_CURRENCY);
  doubleConvertedTickers.push(fromCurrency);
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

  const doubleConvertedIndex = doubleConvertedTickers.indexOf(ticker);
  if (doubleConvertedIndex > - 1 ) {
    unsubscribeFromTickerOnWs(ticker, BTC_CURRENCY);
    doubleConvertedTickers.splice(doubleConvertedIndex, 1);
  }

  unsubscribeFromTickerOnWs(ticker);

};
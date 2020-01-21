function AppViewModel() {
    const self = this;
    var stockDictionary = {};
    self.stockData = ko.observableArray([]);
    
    self.onNewStockData = function(stockList) {
        stockList.forEach((stock) => {
            if(!stockDictionary[stock.name]) {
                stockDictionary[stock.name] = new StockModel(stock);
                self.stockData.push(stockDictionary[stock.name]);
            }
            stockDictionary[stock.name].updatePrice(stock.price);
        });
    }
}

var appmodel = new AppViewModel();
var stockDataServer = new StockDataServer();
ko.applyBindings(appmodel);

stockDataServer.onDataReceived = appmodel.onNewStockData;

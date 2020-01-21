(function() {
    function AppViewModel() {
        const self = this;
        var stockDictionary = {};
        self.stockData = ko.observableArray([]);
        self.serverError = ko.observable(false);

        self.onNewStockData = function(stockList) {
            stockList.forEach((stock) => {
                if(!stockDictionary[stock.name]) {
                    stockDictionary[stock.name] = new StockModel(stock);
                    self.stockData.push(stockDictionary[stock.name]);
                }
                stockDictionary[stock.name].updatePrice(stock.price);
            });
        }

        self.onConnectionError = function(error) {
            self.serverError(true);
        }
    }

    var appmodel = new AppViewModel();
    var stockDataServer = new StockDataServer();
    stockDataServer.onConnectionError = appmodel.onConnectionError;
    stockDataServer.onDataReceived = appmodel.onNewStockData;

    stockDataServer.openConnection();
    ko.applyBindings(appmodel);
    
})();

function StockModel(data) {
    const self = this;
    var intervalId = '';
    const sparkline = new SparklineModel('.svg'+data.name);
    self.name = ko.observable(data.name);
    self.price = ko.observable(data.price.toFixed(3));
    self.isPositiveChange = ko.observable(undefined);
    self.difference = ko.observable('~');
    self.lastUpdatedDate = ko.observable(0);
    self.lastUpdated = ko.observable('Updated Just Now');
    
    var startInterval = function() {
        intervalId = setInterval(() => {
            var lastUpdatedDate = self.lastUpdatedDate();
            self.lastUpdatedDate(++lastUpdatedDate);
        }, 1000);
    }
    
    var resetInterval = function() {
        clearInterval(intervalId);
        self.lastUpdatedDate(0);
        self.lastUpdated('Updated Just Now');
    }
    
    var updateSparkLine = function() {
        sparkline.updateSparkline((new Date()).toString().split(' ')[4], self.price());
    }
    
    self.lastUpdatedDate.subscribe(() => {
        var lastUpdatedDate = self.lastUpdatedDate();
        var time = 0;
        if(lastUpdatedDate < 60) {
            time = lastUpdatedDate === 1 ? ' second' : ' seconds';
            self.lastUpdated('Updated ' + lastUpdatedDate + time + ' ago');
        } else if(lastUpdatedDate >= 60) {
            time = parseInt(lastUpdatedDate / 60) === 1 ? ' minute' : ' minutes';
            self.lastUpdated('Updated ' + parseInt(lastUpdatedDate/60) + time + ' ago');
        } else if(parseInt(lastUpdatedDate / 60) >= 60 && parseInt(lastUpdatedDate / 3600) < 24) {
            time = parseInt(lastUpdatedDate / 3600) === 1 ? ' hour' : ' hours';
            self.lastUpdated('Updated ' + parseInt(lastUpdatedDate / 3600) + time + ' ago');
        } else {
            time = parseInt((lastUpdatedDate / 3600) / 24 ) === 1 ? ' day' : ' days';
            self.lastUpdated('Updated ' + parseInt((lastUpdatedDate / 3600) / 24 ) + time + ' ago');
        }
    })
    
    self.updatePrice = function(price) {
        price = parseFloat(price.toFixed(3));
        if(price === self.price())
            return;
        if(price > self.price()) {
            self.isPositiveChange(true);
            self.difference('+'+ (price - self.price()).toFixed(3));
        } else if(price < self.price()) {
            self.isPositiveChange(false);
            self.difference('-'+ (self.price() - price).toFixed(3));
        }
        self.price(parseFloat(price.toFixed(3)));
        resetInterval();
        startInterval();
        updateSparkLine();
    }
    
}
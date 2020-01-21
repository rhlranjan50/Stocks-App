function StockDataServer() {
    const self = this;
    const url = 'ws://stocks.mnet.website';
    var webSocket;
    
    self.onConnectionOpened = undefined;
    self.onConnectionClosed = undefined;
    self.onDataReceived = undefined;
    self.onConnectionError = undefined;
    
    var onopen = function(event) {
        console.log("Connection to server established successfully!");
        if(self.onConnectionOpened instanceof Function) {
            self.onConnectionOpened(event);
        }
    }
    
    var onmessage = function(event) {
        let data = JSON.parse(event.data);
        data = data.map((d) => { return {'name': d[0], 'price': d[1]} });
        if(self.onDataReceived instanceof Function) {
            self.onDataReceived(data);
        }
    }
    
    var onerror = function(error) {
        console.log("Error encountered while connecting with server!");
        if(self.onConnectionError instanceof Function) {
            self.onConnectionError(error);
        }
    }
    
    var onclose = function(event) {
        console.log("Connection closed successfully!");
        if(self.onConnectionClosed instanceof Function) {
            self.onConnectionClosed(event);
        }
    }
    
    self.closeConnection = function() {
        webSocket.close();
    }
    
    self.openConnection = function() {
        try {
            webSocket = new WebSocket(url);
            webSocket.onopen = onopen;
            webSocket.onmessage = onmessage;
            webSocket.onerror = onerror;
            webSocket.onclose = onclose;
        } catch(error) {
            onerror(error);
        }
    }
}

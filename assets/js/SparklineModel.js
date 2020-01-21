function SparklineModel(svgClassName) {
    const self = this;
    var data = [];
    var findClosest = function(target, tagName) {
      if (target.tagName === tagName) {
        return target;
      }
      while ((target = target.parentNode)) {
        if (target.tagName === tagName) {
          break;
        }
      }
      return target;
    }
    var options = {
        onmousemove: function(event, datapoint) {
            var svg = findClosest(event.target, "svg");
            var offsetX = svg.style.left ? -1 * parseFloat(svg.style.left) : 0;
            var tooltip = svg.nextElementSibling;
            tooltip.hidden = false;
            tooltip.textContent = datapoint.time + ': ' + datapoint.value;
            tooltip.style.top = 0 + 'px';
            tooltip.style.left = event.offsetX - offsetX + 25 + 'px';
          },
        onmouseout() {
            var svg = findClosest(event.target, "svg");
            var tooltip = svg.nextElementSibling;
            tooltip.hidden = true;
        }
    }
    var init = function() {
        var svgElement = document.querySelector(svgClassName);
        var graphRowElementComputedStyle = window.getComputedStyle(document.querySelector('.graph-row'));
        var graphRowElementWidth = parseFloat(graphRowElementComputedStyle.width) - parseFloat(graphRowElementComputedStyle.paddingLeft) - parseFloat(graphRowElementComputedStyle.paddingRight);
        
        var previousLeft = svgElement.style.left ? -1 * parseFloat(svgElement.style.left) : 0; 
        if(10 * data.length >= graphRowElementWidth + previousLeft) {
            svgElement.style.left = -1 * (previousLeft + .5 * graphRowElementWidth);
        }
        svgElement.setAttribute('width', 10 * data.length);
        sparkline.sparkline(svgElement, data, options);
    }
    self.updateSparkline = function(time, value) {
        data.push({
            'time': time,
            'value': value
        });
        init();
    }
}
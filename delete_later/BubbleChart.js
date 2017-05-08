var BubbleChart, root,
  __bind = function(fn, me){ 
  return function()
  { return fn.apply(me, arguments); 
  }; 
  };

BubbleChart = (function() {

  BubbleChart.name = 'BubbleChart';

  function BubbleChart(data) {
    this.hide_details = __bind(this.hide_details, this);
    this.show_details = __bind(this.show_details, this);
    this.move_to_center = __bind(this.move_to_center, this);
    this.display_layout = __bind(this.display_layout, this);
    this.start = __bind(this.start, this);
    this.create_chart = __bind(this.create_chart, this);
	this.create_nodes = __bind(this.create_nodes, this);
	this.year1_filter = __bind(this.year1_filter, this);
	this.year2_filter = __bind(this.year2_filter, this);
	this.year3_filter = __bind(this.year3_filter, this);
	this.year4_filter = __bind(this.year4_filter, this);
	this.year5_filter = __bind(this.year5_filter, this);
	this.redraw_year =  __bind(this.redraw_year, this);
    this.data = data;
    this.width = 940;
    this.height = 500;
    this.tooltip = CustomTooltip("tooltip", 190);
    this.center = {
		x: this.width / 2,
      	y: this.height / 2
    };
    this.layout_gravity = -0.01;
    this.damper = 0.1;
    this.vis = null;
    this.nodes = [];
    this.force = null;
    this.circles = null;
    this.fill_color = d3.scale.ordinal().domain(["low", "medium", "high"]).range(["#d9e3ec", "#e1bebc", "#dbe9b9"]);
	
	//use the max total_amount in the data as the max in the scale's domain
    var max_size = d3.max(this.data, function(d) {
      return parseInt(d.total_trade);
    });
    this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_size]).range([1, 90]);
    this.create_nodes();	
    this.create_chart();
  };
  
  //create node objects that will serve as the data behind each bubble 
  BubbleChart.prototype.create_nodes = function() {
    var _this = this;
    this.data.forEach(function(d) {
      var node;
      node = {
		id:d.id,
		region:d.region,
		radius: _this.radius_scale(parseInt(d.total_trade)),
        value: d.total_trade,
		importsto: d.imports_to,
		exportsfrom: d.exports_from,
		tbalance: d.trade_balance,
        group: d.group,
        year: d.year,
        x: Math.random() * 900,
        y: Math.random() * 800,
      };
      return _this.nodes.push(node);
    });
    return this.nodes.sort(function(a, b) {
      return b.value - a.value;
    });
  }; 
  
 //create svg and then circle representation for each node	 
  BubbleChart.prototype.create_chart = function() {
    var that, _this = this;
		     
    this.vis = d3.select("#vis")
	.append("svg")
	.attr("width", this.width)
	.attr("height", this.height)
	.attr("id", "svg_vis");

	/*not working!
	var nest = d3.nest()
    .key(function(d) { return d.region; })
    .key(function(d) { return d.country; })
    .entries(csv);*/
	
	 this.circles = this.vis.selectAll("circle").data(this.nodes, function(d) {return d.id;});
	
    that = this;
	
    this.circles.enter()
	.append("circle")
	//.attr("r", 0)
	.attr("opacity", 0.9)
	.attr("fill", __bind(function(d) {return this.fill_color(d.group);}, this))
	.attr("stroke-width", 2).attr("stroke", __bind(function(d) {return d3.rgb(this.fill_color(d.group)).darker();}, this))
	.attr("id", function(d) {return "bubble_" + d.id;})
    .on("mouseover", function(d, i) {return that.show_details(d, i, this);})
	.on("mouseout", function(d, i) {return that.hide_details(d, i, this);}) 
	.on("click", function(d, i) { alert("Do something"); });

	return this.circles.transition()
	.duration(1000)
  	.attr("r", function(d) {return d.radius;});
  };
  
 BubbleChart.prototype.year1_filter = function() { 
 	var that, _this = this;
	this.circles = this.vis.selectAll("circle").data(this.nodes.filter(function(d){return d.year == 2010;}));
	return this.redraw_year();
   };
   
 BubbleChart.prototype.year2_filter = function() { 
 	var that, _this = this; 
	this.circles = this.vis.selectAll("circle").data(this.nodes.filter(function(d){return d.year == 2009;}));
	return this.redraw_year();
  }; 
  
 BubbleChart.prototype.year3_filter = function() { 
 	var that, _this = this; 
	this.circles = this.vis.selectAll("circle").data(this.nodes.filter(function(d){return d.year == 2008;}));
	return this.redraw_year();			
  }; 
  
 BubbleChart.prototype.year4_filter = function() { 
 	var that, _this = this;
	this.circles = this.vis.selectAll("circle").data(this.nodes.filter(function(d){return d.year == 2007;}));
	return this.redraw_year();		
  }; 
 
 BubbleChart.prototype.year5_filter = function() { 
 	var that, _this = this;
	this.circles = this.vis.selectAll("circle").data(this.nodes.filter(function(d){return d.year == 2006;}));			
    return this.redraw_year();
  }; 
  
  BubbleChart.prototype.redraw_year = function(){ 
	var that, _this = this;			
    that = this;
	
	//new circles enter
    this.circles.enter().append("circle")
	 .attr("r", 0)
	  .attr("opacity", 0.9)
	  .attr("fill", __bind(function(d) {return this.fill_color(d.group);}, this))
	  .attr("stroke-width", 2).attr("stroke", __bind(function(d) {return d3.rgb(this.fill_color(d.group)).darker();}, this))
	  .attr("id", function(d) {return "bubble_" + d.id;})
	  .on("mouseover", function(d, i) {return that.show_details(d, i, this);})
	  .on("mouseout", function(d, i) {return that.hide_details(d, i, this);})
	  .attr("r", function(d) {return d.radius;});
	   
    //update existing circles
	this.circles
	.attr("r", 0)
	  .attr("opacity", 0.9)
	  .attr("fill", __bind(function(d) {return this.fill_color(d.group);}, this))
	  .attr("stroke-width", 2).attr("stroke", __bind(function(d) {return d3.rgb(this.fill_color(d.group)).darker();}, this))
	  .attr("id", function(d) {return "bubble_" + d.id;})
	  .on("mouseover", function(d, i) {return that.show_details(d, i, this);})
	  .on("mouseout", function(d, i) {return that.hide_details(d, i, this);})
	  .attr("r", function(d) {return d.radius;})
	  .transition().duration(300);
		
	//exit	
	this.circles.exit().transition().duration(300).remove();
		
	return this.display_layout();
  };  
  
 //Charge function to allow for accurate collision detection with nodes of different sizes
  BubbleChart.prototype.charge = function(d) {
    return -Math.pow(d.radius, 2.0)/ 8;
  };
  
 //Starts up the force layout with default values
  BubbleChart.prototype.start = function() {
    return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
  };
  
 //Sets up force layout to display all nodes in one circle
  BubbleChart.prototype.display_layout = function() {
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", __bind(function(e) {
      return this.circles.each(this.move_to_center(e.alpha)).attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
    }, this));
    this.force.start();
  };
  
 //Moves all circles towards the the center of the visualization	
  BubbleChart.prototype.move_to_center = function(alpha) {
     return __bind(function(d) {
      d.x = d.x + (this.center.x - d.x) * (this.damper + 0.02) * alpha;
      return d.y = d.y + (this.center.y - d.y) * (this.damper + 0.02) * alpha;
    }, this);
  };
 
  
  //Show tooltip
  BubbleChart.prototype.show_details = function(data, i, element) {
    var content;
    d3.select(element).attr("stroke", "#42464a");
    content = "<span class=\"title\"><span class=\"value\"> " + data.region + "</span></span><br/></br>";
	content += "<span class=\"name\">Imports:</span><span class=\"value\">    $" + (addCommas(data.importsto)) + "</span><br/>";
	content += "<span class=\"name\">Exports:</span><span class=\"value\">    $" + (addCommas(data.exportsfrom)) + "</span><br/></br>";
    content += "<span class=\"name\">Year:</span><span class=\"value\">    " + data.year + "</span>";
    return this.tooltip.showTooltip(content, d3.event);
  };
  
  //Hide tooltip
  BubbleChart.prototype.hide_details = function(data, i, element) 
  {
    var _this = this;
    d3.select(element).attr("stroke", function(d) 
	{
      return d3.rgb(_this.fill_color(d.group)).darker();
    });
    return this.tooltip.hideTooltip();
  };
  return BubbleChart;
})();

root = typeof exports !== "undefined" && exports !== null ? exports : this;

$(function() {
  var chart, render_chart, render_vis;
  chart = null;
  render_vis = function(csv) {
    return render_chart(csv);
  };
  render_chart = function(csv) {
    chart = new BubbleChart(csv);
    chart.start();
    return root.display_layout();
  };
  root.display_layout = __bind(function() {
    return chart.display_layout();
  }, this);
   root.year1_filter = __bind(function() {
    return chart.year1_filter();
  }, this);
  root.year2_filter = __bind(function() {
    return chart.year2_filter();
  }, this);
  root.year3_filter = __bind(function() {
    return chart.year3_filter();
  }, this);
  root.year4_filter = __bind(function() {
    return chart.year4_filter();
  }, this);
  root.year5_filter = __bind(function() {
    return chart.year5_filter();
  }, this);
  root.toggle_view = __bind(function(view_type) {
	 if(view_type == 2009)
	 {
		 return root.year2_filter();
	 }
	 else if(view_type == 2008)
	 {
		 return root.year3_filter();
	 }
	 else if(view_type == 2007)
	 {
		 return root.year4_filter();
	 }
	 else if(view_type == 2006)
	 {
		 return root.year5_filter();
	 }
	 else
	 {
		 return root.year1_filter();
	 }
  }, this);
  return d3.csv("data/TradeRegion1.csv", render_vis); 
});
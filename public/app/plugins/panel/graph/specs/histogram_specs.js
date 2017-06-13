/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["../../../../../test/lib/common","../histogram"],function(a,b){"use strict";var c,d;b&&b.id;return{setters:[function(a){c=a},function(a){d=a}],execute:function(){c.describe("Graph Histogam Converter",function(){c.describe("Values to histogram converter",function(){var a,b=10;c.beforeEach(function(){a=[1,2,10,11,17,20,29]}),c.it("Should convert to series-like array",function(){b=10;var e=[[0,2],[10,3],[20,2]],f=d.convertValuesToHistogram(a,b);c.expect(f).to.eql(e)}),c.it("Should not add empty buckets",function(){b=5;var e=[[0,2],[10,2],[15,1],[20,1],[25,1]],f=d.convertValuesToHistogram(a,b);c.expect(f).to.eql(e)})}),c.describe("Series to values converter",function(){var a;c.beforeEach(function(){a=[{data:[[0,1],[0,2],[0,10],[0,11],[0,17],[0,20],[0,29]]}]}),c.it("Should convert to values array",function(){var b=[1,2,10,11,17,20,29],e=d.getSeriesValues(a);c.expect(e).to.eql(b)}),c.it("Should skip null values",function(){a[0].data.push([0,null]);var b=[1,2,10,11,17,20,29],e=d.getSeriesValues(a);c.expect(e).to.eql(b)})})})}}});
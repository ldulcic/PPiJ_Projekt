// Table module ////////////////////////////////////
var Table = function module() {
    var opts = {
        width: 200,
        height: 200,
        margins: {top: 20, right: 20, bottom: 20, left: 20}
    };

    function exports(selection) {
        selection.each(function (dataset) {

            //________________________________________________
            // Data
            //________________________________________________
            var columnLabel = dataset.columnLabel;
            var rowLabel = dataset.rowLabel;
            var value = dataset.value;

            //________________________________________________
            // DOM preparation
            //________________________________________________
            // Size
            var chartW = Math.max(opts.width - opts.margins.left - opts.margins.right, 0.1);
            var chartH = Math.max(opts.height - opts.margins.top - opts.margins.bottom, 0.1);

            // SVG
            var svg = d3.select('svg');
            //var svg = parentDiv.append('svg').attr('width', opts.width).attr('height', opts.height);
            var visSvg = svg.append('g').attr('class', 'vis-group').attr('transform', 'translate(' + opts.margins.left + ',' + opts.margins.top + ')');
            var tableBodySvg = visSvg.append('g').attr('class', 'chart-group');
            var tableHeaderSvg = visSvg.append('g').attr('class', 'chart-group');
            var rowHeaderSvg = tableHeaderSvg.append('g').attr('class', 'row-header');
            var colHeaderSvg = tableHeaderSvg.append('g').attr('class', 'col-header');

            //________________________________________________
            // Table
            //________________________________________________
            var rowHeaderLevelNum = 1;
            var colHeaderLevelNum = 1;
            var cellH = chartH / (value.length + rowHeaderLevelNum);
            var cellW = chartW / (value[0].length + colHeaderLevelNum);

            // Row header
            var rowHeaderCell = rowHeaderSvg.selectAll('rect.row-header-cell')
                .data(rowLabel);
            rowHeaderCell.enter().append('rect')
                .attr({
                    class:'row-header-cell',
                    width:cellW, height:cellH,
                    x: 0,
                    y: function(d, i){return i * cellH + (cellH * colHeaderLevelNum)}
                })
                .style({fill:'#eee', stroke:'silver'});

            // Row header text
            rowHeaderCell.enter().append('text')
                .attr({
                    class:'row-header-content',
                    x: 0,
                    y: function(d, i){return i * cellH + (cellH * colHeaderLevelNum)},
                    dx: cellW/2,
                    dy: cellH/2
                })
                .style({fill:'black', 'text-anchor':'middle'})
                .text(function(d, i){return d;});

            // Col header
            var colHeaderCell = colHeaderSvg.selectAll('rect.col-header-cell')
                .data(columnLabel);
            colHeaderCell.enter().append('rect')
                .attr({
                    class:'col-header-cell',
                    width:cellW, height:cellH,
                    x: function(d, i){return i * cellW + (cellW * rowHeaderLevelNum)},
                    y: cellH
                })
                .style({fill:'#eee', stroke:'silver'});

            // Col header text
            colHeaderCell.enter().append('text')
                .attr({
                    class:'col-header-content',
                    x: function(d, i){return i * cellW + (cellW * rowHeaderLevelNum)},
                    y: 0,
                    dx: cellW/2,
                    dy: cellH/2 + cellH
                })
                .style({fill:'black', 'text-anchor':'middle'})
                .text(function(d, i){return d;});

            // Body
            var row = tableBodySvg.selectAll('g.row')
                .data(value);
            row.enter().append('g')
                .attr('class', 'cell row')
                .each(function(pD, pI){
                    // Cells
                    var cell = d3.select(this)
                        .selectAll('rect.cell')
                        .data(pD);
                    cell.enter().append('rect')
                        .attr({
                            class:'cell', width:cellW, height:cellH,
                            x: function(d, i){return i * cellW + (cellW * rowHeaderLevelNum)},
                            y: function(d, i){return pI * cellH + 2*cellH}
                        })
                        .style({fill:'white', stroke:'silver'});
                    // Text
                    cell.enter().append('text')
                        .attr({
                            class:'cell-content', width:cellW, height:cellH,
                            x: function(d, i){return i * cellW + (cellW * rowHeaderLevelNum)},
                            y: function(d, i){return pI * cellH + 2*cellH},
                            dx: cellW/2,
                            dy: cellH/2
                        })
                        .style({fill:'black', 'text-anchor':'middle'})
                        .text(function(d, i){return d;});
                });
        });
    }

    exports.opts = opts;
    createAccessors(exports, opts);
    return exports;
};
  
// Helper function ////////////////////////////////////                       
var createAccessors = function(visExport) {
    for (var n in visExport.opts) {
        if (!visExport.opts.hasOwnProperty(n)) continue;
        visExport[n] = (function(n) {
            return function(v) {
                return arguments.length ? (visExport.opts[n] = v, this) : visExport.opts[n];
            }
        })(n);
    }
};                        
 
// Usage ////////////////////////////////////                        
/*var dataset = {
    rowLabel: ['A', 'B', 'C', 'D', 'E'],
    columnLabel: ['P', 'Q', 'R', 'S'],
    value: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20]]
};
                        
var width = 400;
var height = 300;

var table = Table().width(width).height(height);

d3.select('body')
    .datum(dataset)
    .call(table);*/

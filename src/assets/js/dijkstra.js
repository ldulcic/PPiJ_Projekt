// ---------------- DIJKSTRA ----------------
function Dijkstra(startNode, endNode) {
    this.startNode = startNode;
    this.startNode.value = 0;
    this.endNode = endNode;
    this.pathDoesntExist = false;
    this.openNodes = [];
    this.visited = [startNode];
    this.expand(startNode.expand());
    
    if(this.openNodes.length == 0) {
        this.pathDoesntExist = true;
    } else {
        this.nextSteps = this.getNext();
    }
}

Dijkstra.prototype = {
    constructor: Dijkstra,

    inNextSteps: function(node) {
        if (node == endNode && this.nextSteps.indexOf(endNode) != -1) {
            return this.reconstructPath(node);
        }

        var index = this.nextSteps.indexOf(node);
        if (index == -1) {
            return false;
        }

        this.expand(node.expand());
        this.nextSteps.splice(index, 1);
        this.visited.push(node);

        if (this.nextSteps.length == 0) {
            for (var i = this.nextSteps.length - 1; i >= 0; i--) {
                this.addToOpen(this.nextSteps[i]);
            }
            
            this.nextSteps = this.getNext();
            if(this.nextSteps == null) {
                this.pathDoesntExist;
            }
        }
        
        return true;
    },

    expand: function(nodes) {
        for (var i = nodes.length - 1; i >= 0; i--) {
            if (this.visited.indexOf(nodes[i]) == -1) {
                this.addToOpen(nodes[i]);
            }
        }
    },

    getNext: function() {
        while (this.openNodes.length != 0) {
            var possibleNext = [];
            var tmp = this.openNodes.pop();

            if (this.visited.indexOf(tmp) == -1) {
                possibleNext.push(tmp);
                for (var i = this.openNodes.length - 1; i >= 0; i--) {

                    if (this.visited.indexOf(this.openNodes[i]) != -1) {
                        this.openNodes.pop();
                        continue;
                    }

                    if (this.openNodes[i].value == tmp.value) {
                        var node = this.openNodes.pop();
                        if (possibleNext.indexOf(node) == -1) {
                            possibleNext.push(node);
                        }
                    } else {
                        break;
                    }

                }
                return possibleNext;
            }
        }
        return null;
    },

    addToOpen: function(node) {
        if (this.openNodes.length == 0) {
            this.openNodes.push(node);
            return;
        }

        if (node.value > this.openNodes[0].value) {
            this.openNodes.splice(0, 0, node);
            return;
        }

        for (var i = this.openNodes.length - 1; i >= 0; i--) {
            if (this.openNodes[i].value >= node.value) {
                this.openNodes.splice(i + 1, 0, node);
                break;
            }
        }
    },

    findLink: function(aNode) {
        var prevNode;
        var tempnode;
        for (var i = aNode.links.length - 1; i >= 0; i--) {
            tempnode = aNode.links[i].node;
            if (  (this.visited.indexOf(tempnode) != -1) && (tempnode.value + aNode.links[i].value == aNode.value)) {
                prevNode = tempnode;
            }
        }
        for (var i = aNode.links.length - 1; i >= 0; i--) {
            if(aNode.links[i].node === prevNode){
                return aNode.links[i];
            }
        }
    },

    reconstructPath: function (node) {
        var path = [node];
        var tmp;
        while((tmp = node.cameFrom) != null) {
            path.splice(0, 0, tmp);
            node = tmp;
        }

        return path;
    }

};

// -------------------------------------------
//                   MAIN
// -------------------------------------------


// VARIABLES
var startNode = null;
var endNode = null;
var d3startNode = null;
var d3endNode = null;
var nodes = [];
var dijkstra = null;

var docEl = document.documentElement,
    bodyEl = document.getElementsByTagName('body')[0];

var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
    height = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;

var xLoc = width / 2 - 25,
    yLoc = 100;

// MAIN SVG
var svg = d3.select(settings.appendElSpec).append("svg")
    .attr("width", width)
    .attr("height", height);

var graph = new GraphCreator(svg, [], []);
graph.setIdCt(2);
graph.updateGraph();

// LISTENERS
document.getElementById("selectstart").addEventListener("click", function() {
    GraphCreator.prototype.circleMouseUp = function(d3node, d) {
        startNode = getNode(d.id);
        if (d3startNode != null) {
            d3startNode[0][0].setAttribute("stroke", "black");
        }
        d3node[0][0].setAttribute("stroke", "green");
        d3node.select("circle")[0][0].style.fill = "GreenYellow ";
        d3startNode = d3node;
        document.getElementById("selectend").removeAttribute("disabled");
    }

    GraphCreator.prototype.svgKeyDown = function() {

    }
    GraphCreator.prototype.svgMouseUp = function() {

    }
    GraphCreator.prototype.circleMouseDown = function() {

    }
    GraphCreator.prototype.dragmove = function(d) {

    }
    GraphCreator.prototype.pathMouseDown = function() {

    }
});

document.getElementById("selectend").addEventListener("click", function() {
    GraphCreator.prototype.circleMouseUp = function(d3node, d) {
        endNode = getNode(d.id);
        if (d3endNode != null) {
            d3endNode[0][0].setAttribute("stroke", "black");
        }
        d3node[0][0].setAttribute("stroke", "red");
        d3endNode = d3node;
        document.getElementById("startgame").removeAttribute("disabled");
    }
});

document.getElementById("startgame").addEventListener("click", function() {
    GraphCreator.prototype.circleMouseUp = function(d3node, d) {
        clickedNode = getNode(d.id);
        var edg;
        var l1;
        var l2;
        var e;
        var result = dijkstra.inNextSteps(clickedNode);

        if (result instanceof Array) {
            console.log("uso u kraj");
            for(var j = result.length -1; j > 0; j--){
                l1 = result[j];
                document.getElementById("#"+l1.id).getElementsByTagName("circle")[0].style.stroke = "GreenYellow";
                l2 = result[j-1]
                for (var i = graph.edges.length - 1; i >= 0; i--) {
                    e = graph.edges[i];
                    if( (e.source.id == l1.id && e.target.id == l2.id) || (e.target.id == l1.id && e.source.id == l2.id)){
                        edg = graph.edges[i];
                        break;
                    }
                }
                document.getElementById(edg.id).style.stroke = "#005200";
            }
            d3node.select("circle")[0][0].style.fill = "GreenYellow";
            window.alert("dobro je, ne pritsci vise nista!");
            console.log(result);
        } else if (result) {
            l = dijkstra.findLink(clickedNode);
            for (var i = graph.edges.length - 1; i >= 0; i--) {
                e = graph.edges[i];
                if( (e.source.id == l.node.id && e.target.id == clickedNode.id) || (e.target.id == l.node.id && e.source.id == clickedNode.id)){
                    edg = graph.edges[i];
                    break;
                }

            }
            document.getElementById(edg.id).style.stroke = "#ff6d19"; 
            d3node.select("circle")[0][0].style.fill = "##ff6d19";
        } else {
            wrongAnimation(d3node.select("circle"));

        }
    }

    document.getElementById("selectstart").style.display = "none";
    document.getElementById("selectend").style.display = "none";

    dijkstra = new Dijkstra(startNode, endNode);
});

document.getElementById("enddrawing").addEventListener("click", function() {

    var n;
    for (var i = graph.nodes.length - 1; i >= 0; i--) {
        n = graph.nodes[i];
        nodes.push(new Node(n.x, n.y, n.id));
    }

    var source, target, e;
    for (var i = graph.edges.length - 1; i >= 0; i--) {
        e = graph.edges[i];
        source = getNode(e.source.id);
        target = getNode(e.target.id);
        source.addLink(new Link(target, e.weight));
        target.addLink(new Link(source, e.weight));
    }

    document.getElementById("enddrawing").style.display = "none";
    document.getElementById("selectstart").style.display = "inline-block";
    document.getElementById("selectend").style.display = "inline-block";
    document.getElementById("startgame").style.display = "inline-block";

});

document.getElementById("graph1").addEventListener("click",
    function() {
        GraphCreator.prototype.svgKeyDown = function() {

        }
        GraphCreator.prototype.svgMouseUp = function() {

        }
        GraphCreator.prototype.circleMouseDown = function() {

        }
        GraphCreator.prototype.dragmove = function(d) {

        }
        GraphCreator.prototype.pathMouseDown = function() {

        }
        graph.deleteGraph();
        graph.updateGraph();
        graph.nodes.push({
            "title": "a",
            "x": "200",
            "y": "300",
            "id": 1
        });
        graph.nodes.push({
            "title": "b",
            "x": "800",
            "y": "300",
            "id": 2
        });
        graph.nodes.push({
            "title": "c",
            "x": "500",
            "y": "100",
            "id": 3
        });
        graph.nodes.push({
            "title": "d",
            "x": "500",
            "y": "500",
            "id": 4
        });
        graph.updateGraph();
        graph.edges.push({
            "source": graph.nodes[0],
            "target": graph.nodes[2]
        });
        graph.edges.push({
            "source": graph.nodes[0],
            "target": graph.nodes[3]
        });
        graph.edges.push({
            "source": graph.nodes[2],
            "target": graph.nodes[1]
        });
        graph.edges.push({
            "source": graph.nodes[3],
            "target": graph.nodes[1]
        });
        graph.updateGraph();
    });

// FUNCTIONS

function getNode(id) {
    for (var i = nodes.length - 1; i >= 0; i--) {
        if (nodes[i].id == id) {
            return nodes[i];
        }
    }
    return null;
}

function wrongAnimation(node){
    node
    .transition()
    .style("fill","red")
    .duration(125)
    .transition()
    .style("fill","#F6FBFF")
    .duration(125)
    .transition()
    .style("fill","red")
    .duration(125)
    .transition()
    .style("fill","#F6FBFF")
    .duration(125);
}
import { Graph as D3Graph } from "react-d3-graph";
import React from "react";
import { withFirebase } from "../firebase";

// graph payload (with minimalist structure)
async function itemToGraphData(item, setData, problem, firebase) {
  const getSize = votes => 50 * votes + 500;

  const childNode = node =>
    node.get().then(doc => {
      if (doc.exists) {
        const nodeData = doc.data();
        data.nodes.push({
          id: nodeData.title,
          size: getSize(nodeData.votes)
        });
        data.links.push({
          source: item.title,
          target: nodeData.title
        });
      }
    });

  const parentNode = node =>
    node.get().then(doc => {
      if (doc.exists) {
        const nodeData = doc.data();
        data.nodes.push({
          id: nodeData.title,
          size: getSize(nodeData.votes)
        });
        data.links.push({
          source: nodeData.title,
          target: item.title
        });
      }
    });

  // main node
  let data = {
    nodes: [{ id: item.title, size: 1000 }],
    links: []
  };

  if (problem) {
    await Promise.all(
      item.childConjectures.map(async node => {
        await childNode(node);
      })
    );
    await Promise.all(
      item.parentConjectures.map(async node => {
        await parentNode(node);
      })
    );
  } else {
    await Promise.all(
      item.childConjectures.map(async node => {
        await childNode(node);
      })
    );
    await Promise.all(
      item.parentConjectures.map(async node => {
        await parentNode(node);
      })
    );
    await Promise.all(
      item.childProblems.map(async node => {
        await childNode(node);
      })
    );
    await Promise.all(
      item.parentProblems.map(async node => {
        await parentNode(node);
      })
    );
  }
  setData(data);
}

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const config = {
  directed: true,
  automaticRearrangeAfterDropNode: true,
  collapsible: true,
  height: 400,
  highlightDegree: 2,
  highlightOpacity: 0.2,
  linkHighlightBehavior: true,
  maxZoom: 12,
  minZoom: 0.05,
  nodeHighlightBehavior: true,
  panAndZoom: false,
  staticGraph: false,
  width: 800,
  d3: {
    alphaTarget: 0.05,
    gravity: -250,
    linkLength: 120,
    linkStrength: 2
  },
  node: {
    color: "#d3d3d3",
    fontColor: "black",
    fontSize: 10,
    fontWeight: "normal",
    highlightColor: "red",
    highlightFontSize: 14,
    highlightFontWeight: "bold",
    highlightStrokeColor: "red",
    highlightStrokeWidth: 1.5,
    labelProperty: n => (n.name ? `${n.id} - ${n.name}` : n.id),
    mouseCursor: "crosshair",
    opacity: 0.9,
    renderLabel: true,
    size: 200,
    strokeColor: "none",
    strokeWidth: 1.5,
    svg: "",
    symbolType: "circle",
    viewGenerator: null
  },
  link: {
    color: "lightgray",
    highlightColor: "red",
    mouseCursor: "pointer",
    opacity: 1,
    semanticStrokeWidth: true,
    strokeWidth: 3,
    type: "STRAIGHT"
  }
};

function Graph({ item, problem, firebase }) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    itemToGraphData(item, setData, problem, firebase);
  }, []);

  return (
    <React.Fragment>
      {data && (
        <D3Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={data}
          config={config}
        />
      )}
    </React.Fragment>
  );
}

export default withFirebase(Graph);

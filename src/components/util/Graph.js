import { Graph as D3Graph } from "react-d3-graph";
import React from "react";
import { withFirebase } from "../firebase";

// graph payload (with minimalist structure)
async function itemToGraphData(item, setData, problem, firebase) {
  const getSize = votes => 50 * votes + 500;
  function problemData() {
    item.childConjectures.map(conjecture => {
      console.log("before");
      conjecture.get().then(doc => {
        if (doc.exists) {
          const content = doc.data();
          data.nodes.push({
            id: content.title,
            size: getSize(content.votes)
          });
          data.links.push({
            source: item.title,
            target: content.title
          });
        }
      });
    });
  }

  let data = {
    nodes: [{ id: item.title, size: 500 }],
    links: []
  };
  await problemData();
  setData(data);
  //   return {
  //     nodes: [
  //       {
  //         id: item.title,

  //         size: 10 * 100 + 200
  //       },
  //       { id: "Harry" },
  //       { id: "Sally" },
  //       { id: "Alice" }
  //     ],
  //     links: [
  //       { source: item.title, target: "Alice" },

  //       { source: item.title, target: "Sally" },
  //       { source: item.title, target: "Harry" }
  //     ]
  //   };
}

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
  nodeHighlightBehavior: true,
  directed: true,
  node: {
    color: "lightgreen",
    size: 120,
    highlightStrokeColor: "blue",
    mouseCursor: "pointer"
  },
  link: {
    highlightColor: "lightblue"
  }
};

function Graph({ item, problem, firebase }) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {}, []);

  return (
    <React.Fragment>
      {data && (
        <D3Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={data}
          config={myConfig}
        />
      )}
    </React.Fragment>
  );
}

export default withFirebase(Graph);

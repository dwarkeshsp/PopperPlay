import MaterialLink from "@material-ui/core/Link";
import React from "react";
import { Link } from "react-router-dom";

export default function MetaInfoList({ refList, type }) {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    const items = [];
    Promise.all(
      refList.map(async item => {
        const doc = await item.get();
        if (doc.data() !== undefined)
          items.push({
            title: doc.data().title,
            id: doc.id
          });
      })
    ).then(() => setItems(items));
  }, []);

  return (
    <div>
      {items.map(item => (
        <Link
          to={"/" + type + "/" + item.id}
          style={{ textDecoration: "none" }}
        >
          <MaterialLink variant="subtitle1" color="textSecondary" gutterBottom>
            {item.title}
          </MaterialLink>
        </Link>
      ))}
    </div>
  );
}

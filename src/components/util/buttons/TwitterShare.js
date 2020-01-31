import Fab from "@material-ui/core/Fab";
import TwitterIcon from "@material-ui/icons/Twitter";
import React from "react";
import { TwitterShareButton } from "react-share";

export default function TwitterShare({ item, problem }) {
  return (
    <TwitterShareButton
      url={
        problem
          ? "https://popperplay.com/problem/" + item.id
          : "https://popperplay.com/conjecture/" + item.id
      }
      children={
        <Fab color="primary">
          <TwitterIcon />
        </Fab>
      }
      title={item.creator + " - " + item.title}
      hashtags={item.tags}
    />
  );
}

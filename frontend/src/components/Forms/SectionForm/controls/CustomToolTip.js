import { Tooltip } from "@mui/material";
import React from "react";

export default function CustomToolTip(props) {
  const [show, setShow] = React.useState(false);

  const { title, children } = props;

  const handleClick = () => {
    if (show) setShow(false);
    else setShow(true);
  };
  return (
    <div
      style={{ display: "inline" }}
      onMouseOver={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Tooltip title={title} open={show} onClick={handleClick}>
        {children}
      </Tooltip>
    </div>
  );
}

import React from "react";
import "./Loader.css";
import { animated, useSpring } from "react-spring";

export default function Loader(props) {
  const fadeInAnimationStyle = useSpring({
    to: [{ opacity: 0.2 }, { opacity: 0.8 }, { opacity: 0 }],
    from: { opacity: 0 },
  });

  return (
    <>
      <p
        className="loading-text"
        style={{ color: "#000" }}
      >
        {props.message}
      </p>
      <animated.div className={"loader-wrapper"} style={fadeInAnimationStyle}>
        <span className="loader">
          <span className="loader-inner"></span>
        </span>
      </animated.div>
    </>
  );
}

// const [show, setShow] = React.useState(true);
// const transitions = useTransition(show, {
//   from: { opacity: 0 },
//   enter: { opacity: 1 },
//   leave: {opacity : 0},
//   onRest: () => setShow(!show)
// });

// return transitions((style, item) =>
//   item ? (
//     <animated.div className={"loader-wrapper"} style={style}>
//       <p className="loading-text" style={{ color: "#FFF" }}>
//         {props.message}
//       </p>

//       <span className="loader">
//         <span className="loader-inner"></span>
//       </span>
//     </animated.div>
//   ) : (
//     ""
//   )
// );

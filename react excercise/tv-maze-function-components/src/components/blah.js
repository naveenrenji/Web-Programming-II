import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ConditionalRenderExample = () => {
  const [conditionFlag, setConditionFlag] = useState(false);
  const handleButtonClick = () => {
    console.log("Button Click handled");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`https://api.tvmaze.com/shows?page=0`);
        setConditionFlag(true);
      } catch (e) {
        console.log("end of data");
        setConditionFlag(false);
      }
    }
    fetchData();
  }, [conditionFlag]);

  return (
    <div>
      {!conditionFlag && (
        <Link onClick={handleButtonClick}>Conditional Link</Link>
      )}
    </div>
  );
};

//Extension Files of the TITLE font of the webpage

import React from "react";

const SectionTitle = ({ title, mb = "mb-4" }) => {
  return (
    <div className={`text-center ${mb}`}>
      <h2 className="text-6xl font-semibold">{title}</h2>
    </div>
  );
};

export default SectionTitle;

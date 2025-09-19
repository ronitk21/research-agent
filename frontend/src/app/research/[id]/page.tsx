import React from "react";

const SpecificResearchTopic = ({ params }: { params: { id: string } }) => {
  return <div>{params.id}</div>;
};

export default SpecificResearchTopic;

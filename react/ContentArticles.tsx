import React, { ReactChildren, useEffect, useState } from "react";
import { canUseDOM } from "vtex.render-runtime";

// Styles
import styles from "./styles.css";

interface ContentArticlesProps {

}

const ContentArticles: StorefrontFunctionComponent<ContentArticlesProps> = ({ }) => {

  return (
    <>HelloWorld</>
  )
}

ContentArticles.schema = {
  title: "Content Articles",
  description: "",
  type: "object",
  properties: {

  }
}

export default ContentArticles;
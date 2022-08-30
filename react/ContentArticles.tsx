import React, { ReactChildren, useEffect, useReducer, useState } from "react";
import { canUseDOM } from "vtex.render-runtime";

// Styles
import styles from "./styles.css";

interface ContentArticlesProps {
  articles: Array<ArticleObject>
  interval: number
}

interface ArticleObject {
  title: string
  summary: string
  imgSrc: string
  mobileImgSrc: string
  link: string
}

const ContentArticles: StorefrontFunctionComponent<ContentArticlesProps> = ({ articles, interval }) => {
  const firstArticle: ArticleObject = {
    title: articles[0].title,
    summary: articles[0].summary,
    imgSrc: articles[0].imgSrc,
    mobileImgSrc: articles[0].mobileImgSrc,
    link: articles[0].link
  }

  const [openGate, setOpenGate] = useState<Boolean>(true);
  const [pause, setPause] = useState<Boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [article, setArticle] = useState<ArticleObject>(firstArticle);
  const [listWidth, setListWidth] = useState<number>(0);
  const classPrefix = "eriksbikeshop-contentarticles-1-x-";

  const handleNextClick = () => {
    const newIndex = index === (articles.length - 1) ? 0 : index + 1;
    updateArticle(newIndex);
  }

  const handlePreviousClick = () => {
    const newIndex = index === 0 ? articles.length - 1 : index - 1;
    updateArticle(newIndex);
  }

  const handleHover = () => {
    setPause(true);
  }

  const handleNoHover = () => {
    setPause(false);
  }

  const updateArticle = (newIndex: number) => {
    const tempArticle = {
      title: articles[newIndex].title,
      summary: articles[newIndex].summary,
      imgSrc: articles[newIndex].imgSrc,
      mobileImgSrc: articles[newIndex].mobileImgSrc,
      link: articles[newIndex].link
    }

    if (canUseDOM) {
      const allPosts: Array<any> = Array.from(document.getElementsByClassName(classPrefix + "listItemContainer"));

      let activeNumber: number;
      allPosts.forEach(post => {
        const itemIndex = Number(post.dataset.index);
        allPosts[itemIndex].classList.remove(classPrefix + "activePost");

        if (itemIndex === newIndex) {
          activeNumber = itemIndex;
        }
      })

      allPosts[activeNumber!].classList.add(classPrefix + "activePost");
    }

    // Very strange bug. Starting at the 2nd loop (first loop works fine), the featured image won't
    // update after the last item. All other info works well. So if it's the last item in the list, 
    // set the article to blank for 1 millisecond, then render content. I don't like it either - LM
    if (index === articles.length - 1) {
      const blank = {
        title: "",
        summary: "",
        imgSrc: "",
        mobileImgSrc: "",
        link: "",
      }
      setArticle(blank);
      setTimeout(() => {
        setArticle(tempArticle);
        setIndex(newIndex);
      }, 1)
    } else {
      setArticle(tempArticle);
      setIndex(newIndex);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (!pause && interval) handleNextClick();
    }, interval * 1000);

    return () => {
      clearInterval(timer);
    }
  })

  useEffect(() => {
    if (!openGate) return;
    setOpenGate(false);

    articles.forEach(pic => {
      const preloadedImage = new Image();
      preloadedImage.src = pic.imgSrc;
    })
  })

  useEffect(() => {
    if (!canUseDOM) return;

    const wrapper = document.getElementById("articles-wrapper");
    const wrapperWidth = Number(wrapper?.clientWidth);
    const featureWidth = wrapperWidth * 0.65;
    setListWidth(wrapperWidth - featureWidth)
  })

  const handleChooseArticle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newIndex = Number(e.currentTarget.dataset.index);
    updateArticle(newIndex);
  }

  return (
    <div onMouseOver={handleHover} onMouseOut={handleNoHover} className={styles.articlesContainer}>
      <div id="articles-wrapper" className={styles.articlesWrapper}>
        <div className={styles.featuredContainer}>
          <a href={article.link} className={styles.featuredLink}>
            <figure className={styles.featuredFigure}>
              <div className={styles.featuredTextContainer}>
                <h3 className={styles.featuredTitle}>{article.title}</h3>
                <figcaption className={styles.featuredSummary}>{article.summary}</figcaption>
              </div>
              <img src={article.imgSrc} className={styles.image} />
            </figure>
          </a>
        </div>
        <div className={styles.listContainer}>
          {articles.map((post, index) => (
            <button key={post.title} data-index={index} onClick={handleChooseArticle} className={`${styles.listItemContainer} ${index === 0 ? styles.activePost : ""}`}>
              <div style={{ backgroundImage: `url(${post.mobileImgSrc})` }} className={styles.listItemImg} ></div>
              <div className={styles.listItemText}>
                <div className={styles.listItemTitle}>
                  {post.title}
                </div>
                <div style={{ width: `${listWidth * 0.75}px` }} className={styles.listItemSummary}>
                  {post.summary}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

ContentArticles.schema = {
  title: "Content Articles",
  description: "",
  type: "object",
  properties: {
    interval: {
      type: "number",
      title: "Interval Time in Seconds",
      description: "Set to 0 to disable."
    },
    articles: {
      type: "array",
      title: "Articles",
      items: {
        properties: {
          __editorItemTitle: {
            title: "Site Editor Article Title",
            type: "string"
          },
          title: {
            title: "Title",
            type: "string"
          },
          summary: {
            title: "Summary",
            description: "1 to 2 sentence description of the article.",
            type: "string"
          },
          imgSrc: {
            title: "Desktop Image Source",
            description: "REQUIRED - Absolute path to image.",
            type: "string"
          },
          mobileImgSrc: {
            title: "Mobile Image Source",
            description: "Required - Absolute path to image.",
            type: "string"
          },
          link: {
            title: "Link to article",
            description: "Relative or Absolute path to article.",
            type: "string"
          }
        }
      }
    }
  }
}

export default ContentArticles;
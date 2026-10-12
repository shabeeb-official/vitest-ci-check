const productDetailsScrollToTop = () => {
  const container = document.querySelector("#sunny-root");
  if (container) {
    const target = container.shadowRoot
      .querySelector("div")
      .querySelector("#layout-container");

    if (target) {
      target.scroll({
        top: 0,
        behavior: "smooth",
      });
    }
  }
};

export default productDetailsScrollToTop;

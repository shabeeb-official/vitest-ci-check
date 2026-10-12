export const handleTextSelection = (
  e: React.PointerEvent<HTMLParagraphElement>,
) => {
  if (e.nativeEvent.pointerType === "mouse") {
    e.stopPropagation();
  }
};

export type ExpandedCardRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ExpandedCardState = {
  entryId: string;
  sourceRect: DOMRect;
  targetRect: ExpandedCardRect;
  sourceTransform: string;
  phase: "entering" | "open" | "closing";
};

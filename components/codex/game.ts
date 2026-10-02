export type Choice = 0 | 1 | 2;
export type Ending = "sold" | "counterYes" | "counterNo" | "wait";
export function offerFor(first: Choice, second: Choice) {
  const opening = story.decisions[0].options[first];
  const comparison = story.decisions[1].options[second];
  if (!("base" in opening) || !("delta" in comparison))
    throw new Error("Preisregel fehlt in der Story.");
  return opening.base + comparison.delta;
}
export function finish(first: Choice, second: Choice, third: Choice) {
  const offer = offerFor(first, second);
  const ending: Ending =
    third === 0
      ? "sold"
      : third === 2
        ? "wait"
        : offer >= 6200
          ? "counterYes"
          : "counterNo";
  return {
    offer,
    ending,
    sold: ending === "sold" || ending === "counterYes",
    price: ending === "counterYes" ? 6400 : ending === "sold" ? offer : null,
  };
}
export const euros = (value: number) =>
  new Intl.NumberFormat("de-DE").format(value) + " €";
import story from "../../stories/codex-autoverkauf.json" with { type: "json" };

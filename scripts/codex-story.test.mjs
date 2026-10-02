import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { finish, offerFor } from "../components/codex/game.ts";
const root = new URL("../", import.meta.url);
const story = JSON.parse(
  readFileSync(new URL("stories/codex-autoverkauf.json", root), "utf8"),
);
const manifest = JSON.parse(
  readFileSync(new URL("public/audio/codex/manifest.json", root), "utf8"),
);

test("Alle 27 Wege erreichen nach genau drei Entscheidungen ein schlüssiges Ende", () => {
  assert.equal(story.decisions.length, 3);
  const outcomes = new Set();
  for (let a = 0; a < 3; a++)
    for (let b = 0; b < 3; b++)
      for (let c = 0; c < 3; c++) {
        const end = finish(a, b, c);
        outcomes.add(end.ending);
        assert.equal(end.offer, offerFor(a, b));
        const clips = [...story.intro];
        [a, b, c].forEach((option, step) => {
          assert.equal(story.decisions[step].options.length, 3);
          clips.push(
            ...story.decisions[step].options[option].clips,
            ...story.decisions[step].rejoin,
          );
        });
        assert.equal(clips.filter((id) => id === "question").length, 3);
        clips.push(end.ending, end.sold ? "resultSold" : "resultOpen");
        for (const id of clips) assert.ok(story.clips[id], `Clip fehlt: ${id}`);
        if (c === 0) {
          assert.equal(end.sold, true);
          assert.equal(end.price, end.offer);
        }
        if (c === 2) {
          assert.equal(end.sold, false);
          assert.equal(end.price, null);
        }
        if (end.sold) assert.ok(end.price >= 5900 && end.price <= 6400);
        else assert.equal(end.price, null);
        const duration =
          clips.reduce(
            (sum, id) =>
              sum +
              Math.max(
                story.clips[id].seconds,
                manifest.files[id].duration + 0.7,
              ),
            0,
          ) +
          ["reveal1", "reveal2", "reveal3"].reduce(
            (sum, id) =>
              sum +
              Math.max(
                story.clips[id].seconds,
                manifest.files[id].duration + 0.7,
              ),
            0,
          );
        assert.ok(
          duration >= 120 && duration <= 180,
          `Laufzeit ${duration}s passt nicht.`,
        );
      }
  assert.deepEqual([...outcomes].sort(), [
    "counterNo",
    "counterYes",
    "sold",
    "wait",
  ]);
});
test("Alle Tonspuren und Untertitel vorhanden; kein Zeichenbudget überschritten", () => {
  let chars = 0;
  for (const [id, clip] of Object.entries(story.clips)) {
    const entry = manifest.files[id];
    assert.equal(entry.status, "complete");
    assert.ok(
      existsSync(fileURLToPath(new URL(`public/audio/codex/${id}.mp3`, root))),
    );
    assert.equal(entry.characters, clip.text.length);
    assert.ok(entry.duration > 0);
    assert.equal(entry.cues.map((c) => c.text).join(" "), clip.text);
    let last = 0;
    for (const cue of entry.cues) {
      assert.ok(cue.end >= last);
      last = cue.end;
    }
    chars += clip.text.length;
  }
  assert.equal(chars, 2449);
  assert.ok(manifest.attemptedCharacters <= 3000);
});
test("Beispiel ist erreichbar und kein vierter Entscheidungsdialog", () => {
  const end = finish(1, 0, 1);
  assert.equal(end.price, 6400);
  assert.equal(end.sold, true);
  for (const id of ["exampleIntro", "b1", "a2", "b3", "counterYes"])
    assert.ok(story.clips[id]);
  assert.ok(story.sources.some((s) => s.type === "Studie"));
  assert.ok(story.sources.some((s) => s.type === "Buchwissen"));
});

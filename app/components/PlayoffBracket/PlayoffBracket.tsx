import "@/app/styles/global/global.css";

import { memo } from "react";
import {
  PlayoffMatchView,
  PlayoffSideView,
  PlayoffView,
} from "@/app/types/playoffView";

type PlayoffBracketProps = {
  view: PlayoffView;
  onWinnerClick?: (matchId: number, participantId: number) => void;
};

function sideClassName(side: PlayoffSideView, isSelectable: boolean): string {
  const classes = ["playoff-side"];
  if (side.participantId === null) classes.push("placeholder");
  if (side.isWinner) classes.push("winner");
  if (isSelectable) classes.push("selectable");
  return classes.join(" ");
}

function PlayoffBracket({ view, onWinnerClick }: PlayoffBracketProps) {
  function renderSide(match: PlayoffMatchView, side: PlayoffSideView) {
    const isSelectable =
      match.isSelectable && side.participantId !== null && !!onWinnerClick;

    return (
      <button
        type="button"
        className={sideClassName(side, isSelectable)}
        disabled={!isSelectable}
        onClick={() => {
          if (isSelectable && onWinnerClick && side.participantId !== null) {
            onWinnerClick(match.id, side.participantId);
          }
        }}
      >
        <span className="playoff-seed">{side.seed}</span>
        <span>{side.label}</span>
      </button>
    );
  }

  return (
    <div className="playoff-container">
      {view.rounds.map((round) => (
        <div key={round.title} className="playoff-round">
          <h2 className="playoff-round-title">{round.title}</h2>
          <div className="playoff-matches">
            {round.matches.map((match) => (
              <div key={match.id} className="playoff-match">
                {renderSide(match, match.first)}
                {renderSide(match, match.second)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(PlayoffBracket);

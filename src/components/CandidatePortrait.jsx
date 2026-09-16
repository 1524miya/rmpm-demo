export default function CandidatePortrait({ candidate, size = 'card' }) {
  if (!candidate?.portrait) return null;

  return <img
    className={`candidate-portrait candidate-portrait-${size}`}
    src={candidate.portrait}
    alt={`${candidate.name}候補のドット絵アイコン`}
  />;
}

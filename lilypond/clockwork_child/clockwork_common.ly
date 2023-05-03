
\header {
  title = "Maker Fire Clockwork Child"
  composer = "John Asmuth"
  tagline = ""
}

\paper { ragged-last = ##t }

\include "../bbarred.ly"
#(define RH rightHandFinger)

fullcyclerest = { 
  R1*10 |
}
fullcyclespace = { 
  s1 | s1 | s1 | s1 |
  s1 | s1 | s1 | s1 |
  s1 | s1 |
}

\include "clockwork_child_a.ly"
\include "clockwork_child_b.ly"
\include "clockwork_child_c.ly"

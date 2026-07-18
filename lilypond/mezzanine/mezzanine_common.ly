
\header {
  title = "Singing from the Mezzanine"
  composer = "John Asmuth"
  tagline = ""
}

\paper { ragged-last = ##t }

\include "../bbarred.ly"
#(define RH rightHandFinger)

\layout {
  \context {
    \Voice
    fingeringOrientations = #'(left)
    stringNumberOrientations = #'(up)
  }
}

\include "mezzanine_a.ly"

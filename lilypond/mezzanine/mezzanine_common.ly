
\header {
  title = "Singing from the Mezzanine"
  composer = "John Asmuth"
  tagline = ""
}

\paper { ragged-last = ##t }

\include "../bbarred.ly"
#(define RH rightHandFinger)

stringNumberSpanner =
#(define-music-function (StringNumber) (string?)
  #{
    \override TextSpanner.style = #'solid
    \override TextSpanner.font-size = #-5
    \override TextSpanner.bound-details.left.stencil-align-dir-y = #CENTER
    \override TextSpanner.bound-details.left.text =
      \markup { \circle \number #StringNumber }
  #})

guitarSetup = {
  \clef "treble_8"
}

\layout {
  \context {
    \Voice
    fingeringOrientations = #'(left)
    stringNumberOrientations = #'(up)
  }
}

\include "mezzanine_a.ly"

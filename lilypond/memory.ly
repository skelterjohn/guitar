\version "2.18.2"
\header {
  title = "Memory"
  composer = "Yoko Kanno"
  arranger = "Arr. John Asmuth"
  
}

\include "bbarred.ly"
#(define RH rightHandFinger)

\score {
<<
\new Staff {
  \time 3/4
  \clef "treble"
 
  \key f \major
 
  \partial 1
 
  b'4
 
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(down)
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
    }
  >>
  
}
>>

}
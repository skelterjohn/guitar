\version "2.20.0"
\header {
  title = "Maker Fire Clockwork Child"
  composer = "John Asmuth"
  tagline = ""
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)

<<
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Child"
  shortInstrumentName = #"E."
}
{
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      r1 r1 r1 r1
      r1 r1 r1 r1
      r1 r1
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
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
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Clockwork"
  shortInstrumentName = #"C."
}
{
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      r1 r1 r1 r1
      r1 r1 r1 r1
      r1 r1
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
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
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Fire"
  shortInstrumentName = #"F."
}
{
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      r1 r1 r1 r1
      r1 r1 r1 r1
      r1 r1
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
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
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Maker"
  shortInstrumentName = #"M."
}
{
  \set Staff.connectArpeggios = ##t
  % \partial 4
  \key a \minor
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      <e-0>8-"open string, detuning" e e e e e e e | e e e e e e e e |
      <dis-0>8 dis dis dis dis dis dis dis | dis dis dis dis dis dis dis dis |
      
      <e-0>8 e e e e e e e | e e e e e e e e |
      <dis-0> dis dis dis dis dis dis dis | dis dis dis dis dis dis dis dis |
      
      <cis-0>8 cis cis cis cis cis cis cis | dis dis dis dis dis dis dis dis |
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
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
\version "2.20.0"
\header {
  title = "Maker Fire Clockwork Child"
  composer = "John Asmuth"
  tagline = ""
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
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

<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Child"
    shortInstrumentName = #"Ch."
  } {
    \tempo 4 = 140
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \mark \markup \circle A
        
        \child_a_one
      }
    >>
    <<
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \mark \markup \circle B
        \child_b_two
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \mark \markup \circle C
        \child_c_one
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \child_c_two
      }
    >>
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Clockwork"
    shortInstrumentName = #"Cl."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \clockwork_a_one
        \clockwork_b_one
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \clockwork_c_one
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \clockwork_c_two
      }
    >>
  }
  
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Fire"
    shortInstrumentName = #"F."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \fire_a_one
        \fire_b_one
        \fire_c_one
      }
    >>
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Maker"
    shortInstrumentName = #"M."
  } {
    \set Staff.connectArpeggios = ##t
    % \partial 4
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \maker_a_one
        \maker_b_one
        \maker_c_one
      }
    >>
  }
>>
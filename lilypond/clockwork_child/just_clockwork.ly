\version "2.20.0"
combinedbreak={}
solobreak=\break
solopage=\pageBreak
\include "clockwork_common.ly"

\compressMMRests <<
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
        
        \tempo_a
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
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \clockwork_d_one
      }
    >>
  }
  
>>
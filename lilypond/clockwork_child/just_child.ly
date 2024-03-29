\version "2.20.0"
combinedbreak={}
solobreak=\break
solopage=\pageBreak
\include "clockwork_common.ly"

\compressMMRests <<
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
        
        \tempo_a
        
        \child_a_one
      }
    >>
    <<
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \child_b_two
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \child_c_one
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \child_c_two
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \child_d_one
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \child_d_two
      }
    >>
  }
>>

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
        
        \mark \markup \circle A
        \tempo_a
        \clockwork_a_one
        
        \mark \markup \circle B
        \clockwork_b_one
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \mark \markup \circle C
        \clockwork_c_one
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \clockwork_c_two
      }
    >>
  }
  
>>
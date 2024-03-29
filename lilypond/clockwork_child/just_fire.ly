\version "2.20.0"
combinedbreak={}
solobreak=\break
solopage=\pageBreak
\include "clockwork_common.ly"

\compressMMRests <<
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
        
        \tempo_a
        \fire_a_one
        \fire_b_one
        \fire_c_one
        \fire_d_one
      }
    >>
  }
>>
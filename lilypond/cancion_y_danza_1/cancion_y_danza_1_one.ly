\version "2.24.0"

solobreak={\break}
solopage={\pageBreak}
allbreak={}
allpage={}
\include "cancion_y_danza_1_common.ly"

\score {<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 1"
    shortInstrumentName = #"G1."
  } {
    \cancion_one
    \bar "||"
  }
>>
}
\score {<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 1"
    shortInstrumentName = #"G1."
  } {
    \danza_one
    \bar "|."
  }
>>}

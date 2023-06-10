\version "2.24.0"

solobreak={\break}
solopage={\pageBreak}
allbreak={}
allpage={}
\include "cancion_y_danza_1_common.ly"

\score {<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 2"
    shortInstrumentName = #"G2."
  } {
    \cancion_two
    \bar "||"
  }
>>
}
\score {<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 2"
    shortInstrumentName = #"G2."
  } {
    \danza_two
    \bar "|."
  }
>>}

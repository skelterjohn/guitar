\version "2.24.0"

solobreak={\break}
solopage={\pageBreak}
allbreak={}
allpage={}
\include "cancion_y_danza_1_common.ly"

\score {<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 4"
    shortInstrumentName = #"G4."
  } {
    \cancion_four
    \bar "||"
  }
>>
}
\score {<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 4"
    shortInstrumentName = #"G4."
  } {
    \danza_four
    \bar "|."
  }
>>}

\version "2.20.0"

solopage={\pageBreak}
\include "fools_common.ly"
\compressMMRests <<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 4"
    shortInstrumentName = #"G4."
  } {
    \fools_four_a 
    \fools_four_b
    \bar "|."
  }
>>
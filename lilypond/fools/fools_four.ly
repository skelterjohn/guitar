\version "2.20.0"

\include "fools_common.ly"

<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 4"
    shortInstrumentName = #"G4."
  } {
    \fools_four_a 
  }
>>
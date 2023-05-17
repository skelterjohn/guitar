\version "2.20.0"

\include "fools_common.ly"

<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 3"
    shortInstrumentName = #"G3."
  } {
    \fools_three_a 
  }
>>
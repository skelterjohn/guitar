\version "2.20.0"

\include "fools_common.ly"

<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 1"
    shortInstrumentName = #"G1."
  } {
    \fools_one_a 
  }
>>
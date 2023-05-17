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
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 2"
    shortInstrumentName = #"G2."
  } {
    \fools_two_a
  }
  
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 3"
    shortInstrumentName = #"G3."
  } {
    \fools_three_a
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 4"
    shortInstrumentName = #"G4."
  } {
    \fools_four_a
  }
>>
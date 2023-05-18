\version "2.20.0"

solopage={}
\include "fools_common.ly"

<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 1"
    shortInstrumentName = #"G1."
  } {
    \fools_one_a 
    \fools_one_b 
    \bar "|."
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 2"
    shortInstrumentName = #"G2."
  } {
    \fools_two_a
    \fools_two_b
    \bar "|."
  }
  
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 3"
    shortInstrumentName = #"G3."
  } {
    \fools_three_a
    \fools_three_b
    \bar "|."
  }
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
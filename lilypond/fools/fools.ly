\version "2.20.0"

solopage={}
\include "fools_common.ly"

\score {<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 1"
    shortInstrumentName = #"G1."
  } {
    \fools_one_a 
    \fools_one_b 
    \fools_one_c
    \bar "|."
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 2"
    shortInstrumentName = #"G2."
  } {
    \fools_two_a
    \fools_two_b
    \fools_two_c
    \bar "|."
  }
  
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 3"
    shortInstrumentName = #"G3."
  } {
    \fools_three_a
    \fools_three_b
    \fools_three_c
    \bar "|."
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 4"
    shortInstrumentName = #"G4."
  } {
    \fools_four_a
    \fools_four_b
    \fools_four_c
    \bar "|."
  }
>>}

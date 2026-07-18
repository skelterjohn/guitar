\version "2.24.0"

solopage={}
\include "mezzanine_common.ly"

\score {<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 1"
    shortInstrumentName = #"G1."
  } {
    \mezzanine_one_a
    \bar "|."
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 2"
    shortInstrumentName = #"G2."
  } {
    \mezzanine_two_a
    \bar "|."
  }
  
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 3"
    shortInstrumentName = #"G3."
  } {
    \mezzanine_three_a
    \bar "|."
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 4"
    shortInstrumentName = #"G4."
  } {
    \mezzanine_four_a
    \bar "|."
  }
>>}

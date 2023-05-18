\version "2.20.0"

solopage={\pageBreak}
\include "fools_common.ly"

\compressMMRests <<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 3"
    shortInstrumentName = #"G3."
  } {
    \fools_three_a 
    \fools_three_b
    \bar "|."
  }
>>
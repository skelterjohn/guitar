\version "2.20.0"

solopage={\pageBreak}
\include "fools_common.ly"

\score {
  \compressMMRests <<
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
>> }
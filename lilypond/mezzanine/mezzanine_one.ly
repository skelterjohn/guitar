\version "2.20.0"

solopage={\pageBreak}
\include "mezzanine_common.ly"

\score {
  \compressMMRests <<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Guitar 1"
    shortInstrumentName = #"G1."
  } {
    \mezzanine_one_a
    \bar "|."
  }
>> }

\version "2.20.0"

solopage={\pageBreak}
\include "fools_common.ly"

\score {
  \compressMMRests <<
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
  >>
}

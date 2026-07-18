\version "2.20.0"

solopage={\pageBreak}
\include "mezzanine_common.ly"

\score {
  \compressMMRests <<
    \new Staff \with {
      \consists "Span_arpeggio_engraver"
      instrumentName = #"Guitar 2"
      shortInstrumentName = #"G2."
    } {
      \mezzanine_two_a
      \bar "|."
    }
  >>
}

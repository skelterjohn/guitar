\version "2.20.0"

solopage={\pageBreak}
\include "mezzanine_common.ly"

\score {
	\compressMMRests <<
		\new Staff \with {
			\consists "Span_arpeggio_engraver"
			instrumentName = #"Guitar 4"
			shortInstrumentName = #"G4."
		} {
			\mezzanine_four_a
			\bar "|."
		}
	>>
}

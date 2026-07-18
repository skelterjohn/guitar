\version "2.20.0"

solopage={\pageBreak}
\include "mezzanine_common.ly"

\score {
	\compressMMRests <<
		\new Staff \with {
			\consists "Span_arpeggio_engraver"
			instrumentName = #"Guitar 3"
			shortInstrumentName = #"G3."
		} {
			\mezzanine_three_a
			\bar "|."
		}
	>>
}

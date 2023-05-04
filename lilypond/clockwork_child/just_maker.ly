\version "2.20.0"
combinedbreak={}
solobreak=\break
solopage=\pageBreak
\include "clockwork_common.ly"

\compressMMRests <<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Maker"
    shortInstrumentName = #"M."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \tempo_a
        \mark \markup \circle A
        \maker_a_one
        \mark \markup \circle B
        \maker_b_one
      }
      \new Voice { \voiceTwo
        
        s1^"open string, detuning, retuning"
      }
    >>
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \mark \markup \circle C
        \maker_c_one
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \maker_c_two
      }
    >>
  }
>>
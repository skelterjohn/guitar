\version "2.24.1"

\include "common.ly"

\header {
  title = "Doobeydee-Roo"
  composer = "Shubert"
}


\score {
  <<
    \new Staff \with {
      \consists "Span_arpeggio_engraver"
    } {
      \time 3/8
      \key ees \major
      \clef bass
      
      R4.*7 |
      bes8 8. 16 |
      c'4 8 |
      ees'4 d'8 |
      ees'4. |
    }
    \new PianoStaff <<
      \new Staff {
        \time 3/8
        \key ees \major
        
        g'16(_\pp bes' g' bes' g' bes' |
        g' c'' g' c'' g' c'') |
        c''( f' c'' f' bes' f') |
        <<
          \new Voice {\voiceOne
            ees''4.~ |
            <bes' ees'' bes''>4. |
            <bes' bes''>4.~ |
            <bes' bes''>8
          }
          \new Voice {\voiceTwo
            bes'16 ees' bes' ees' aes' ees' |
            bes'4. |
            ees''8 d''16 c'' d''8 |
            <bes' ees''>8
          }
        >>
        g'16( bes' g' bes') |
        g'16_\pp bes' g' bes' g' bes' |
        g'16 c'' g' c'' g' c'' |
        <<
          \new Voice {\voiceOne
            ees''4( d''8 |
            ees''4.) |
          }
          \new Voice {\voiceTwo
            g'16 bes' g' bes' aes' bes' |
            g'16 bes' g' bes' g' bes' |
          }
        >>
      }
      \new Staff {
        \time 3/8
        \key ees \major
        \clef bass
        
        \clef treble
        ees'8 8. 16 |
        ees'4. |
        d'4. |
        c'4. |
        <<
          \new Voice {\voiceOne
            aes'16^\< ees' aes' ees' g' ees'^\! |
            f'16^\> aes' f' aes' f' aes'^\! |
          }
          \new Voice {\voiceTwo
            bes4. |
            bes4. |
          }
        >>
        <ees' g'>8 r8 r8 \clef bass |
        ees'8 8. 16 |
        ees'4. |
        <g ees'>4( <bes f'>8 |
        ees'4.) |
      }
    >>
  >>
}

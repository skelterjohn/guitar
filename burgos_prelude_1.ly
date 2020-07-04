\version "2.18.2"
\header {
  title = "Prelude No. 1"
  composer = "Francisco Burgos"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

#(define RH rightHandFinger)

<<
  {
    \time 6/4
    \key c \major
    
   
    <<
      \new Voice { \voiceOne
        \bar ".|:"
        f'8 e' f'8 g' b' e'' g' c' e' g' g' e'' |
        d'' bes f' gis' d'' f'' e'' e' g' c'' g'4 | \break
      }
      \new Voice { \voiceTwo
        |
        |
      }
      \new Voice { \voiceThree
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        f'8 e' f'8 g' b' e'' g' c' e' g' g' e'' |
        d'' bes f' gis' d'' f'' e'' gis f' b' f'4 | \break
      }
      \new Voice { \voiceTwo
        |
        |
      }
      \new Voice { \voiceThree
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        a'8 f c' d' a' b' c'' a e' g' c'' e''|
        d'' b e' gis' d'' e''<e d' gis' f''>2 e''4 | \break
      }
      \new Voice { \voiceTwo
        |
        |
      }
      \new Voice { \voiceThree
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        a''8 d' a' d'' \tuplet 3/4 {<b f''> cis' <d' g' d''>} d' g' b' d'' |
        r8 <cis'' g''>4 <cis'' g''>4 <cis'' g''>8 <e' bes' cis''>2  d''8 e'' | \break
      }
      \new Voice { \voiceTwo
        s1. |
        e'4 d' cis' e'2 s4 |
      }
      \new Voice { \voiceThree
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        f''8 d' gis' c'' f'' c'' g'' d' a' c'' g'' c''|
        g'' e' bes' cis'' g'' cis'' a''2. | \break
      }
      \new Voice { \voiceTwo
        |
        |
      }
      \new Voice { \voiceThree
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        a''8 d' a' g' \tuplet 3/4 {<d'' f''> <b' e''> <d' b' d''>} d' g' b' d''|
        r8 <cis'' g''>4 <cis'' g''>4 <cis'' g''>8 <e' bes' cis''>2 d''8 e'' | \break
      }
      \new Voice { \voiceTwo
        s1. |
        e'4 d' cis' e'2 s4|
      }
      \new Voice { \voiceThree
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        f''8 d' gis' c'' f'' c'' <g b'> d' f' g' b' e''|
        c'' c' e' g' c'' e'' c''2. \bar ":|." \break
      }
      \new Voice { \voiceTwo
        |
        |
      }
      \new Voice { \voiceThree
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        |
        | \break
      }
      \new Voice { \voiceTwo
        |
        |
      }
      \new Voice { \voiceThree
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
      }
    >>
  }
>>
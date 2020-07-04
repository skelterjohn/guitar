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
        d'' bes f' gis' d'' f'' e'' \mark "rit." e' g' c'' g'4 | \break
      }
      \new Voice { \voiceTwo
        s4 f'4 s4 g'4 s2 |
        d''4 s2 e''4 s2 |
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
        \mark "a tempo" f'8 e' f'8 g' b' e'' g' c' e' g' g' e'' |
        d'' bes f' gis' d'' f'' e'' \mark "rit." gis f' b' f'4 | \break
      }
      \new Voice { \voiceTwo
        s4 f'4 s4 g'4 s2 |
        d''4 s2 e''4 s2 |
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
        a'8 \mark "a tempo" f c' d' a' b' c'' a e' g' c'' e''|
        d'' b e' gis' d'' e'' <d' gis' f''>2 e''4 | \break
      }
      \new Voice { \voiceTwo
        a'4 s2 c''4 s2 |
        d''4 s2 <e d'>2 s4 |
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
        a''8[ d' a' d'' \tuplet 3/4 {<b d'' f''>] <cis' b' e''> <d' g' d''>[} d' g' b' d''] |
        r8 <cis'' g''>4 <cis'' g''>4 <cis'' g''>8 <e' bes' cis''>2  d''8 e'' | \break
      }
      \new Voice { \voiceTwo
        a''4 s4 \tuplet 3/4 {b8 cis' <d'>} s2 |
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
        f''4 s4 f''4 g''4 s4 g''4 |
        g''4 s4 g''4 a''2.|
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
        a''8[ d' a' g' \tuplet 3/4 {<b d'' f''>] <cis' b' e''> <d' g' d''>[} d' g' b' d'']|
        r8 <cis'' g''>4 <cis'' g''>4 <cis'' g''>8 <e' bes' cis''>2 d''8 e'' | \break
      }
      \new Voice { \voiceTwo
        a''4 s4 \tuplet 3/4 {b8 cis' <d'>8} s2 |
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
        f''4 s2 <g>4 s2 |
        c''4 s2 c''2. |
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
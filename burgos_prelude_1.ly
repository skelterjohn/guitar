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
    \time 12/8
    \key c \major
    
   
    <<
      \new Voice { \voiceOne
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
        a''8 d' a' \tuplet 2/3 {d'' <b f''> cis' } <d' g' d''> d' g' b' d'' |
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
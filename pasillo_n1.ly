\version "2.18.2"
\header {
  title = "Pasillo No. 1"
  composer = "Prof Francisco A. Velasquez"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

<<
  {
    \time 3/4
    \key g \major
    r8 
    <<
      \new Voice { \voiceOne
        b'-0 cis''-2[ dis''-4] e''-0[ fis''-1] |
        s4 c'''4 s8 b''8 |
        g8[ g'] e''4 r8 fis'' |
      }
      \new Voice { \voiceTwo
        b'-3 ais'-3[ a'-1] g'-0[ fis'-3] |
        s4 c'''8[ b'] g'[ b''] |
        s4 e''8[ b'] g'[ fis''] |
      }
      \new Voice { \voiceFour
        s2 s8 |
        e4~ e2 |
        g4~ g2 |
      }
    >>
    <<
      \new Voice { \voiceOne
        fis8[ a'] e''4 r8 e''|
        \fbarre #"2 "{ b8[ dis''] (e'')[ fis''] g''[ (fis'')] }|
        a8[ e'] c''4 s8 b'8 |
      }
      \new Voice { \voiceTwo
        s4 e''8[ c''] a'[ e''] |
        s2. |
        s4  c''8[ g'~] <g' e'>[ b'] |
      }
      \new Voice { \voiceFour
        fis4~ fis2 |
        b4 b2 |
        a4~ a2|
      }
    >>
    <<
      \new Voice { \voiceOne
        |
        |
        |
      }
      \new Voice { \voiceTwo
        |
        |
        |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        |
        |
        |
      }
      \new Voice { \voiceTwo
        |
        |
        |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
        |
      }
    >>
  }
>>

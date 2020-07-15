\version "2.18.2"
\header {
  title = "Orange Wishing Tree"
  subtitle = "draft 3"
  composer = "John Asmuth"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

#(set-global-staff-size 23)
<<
  \relative d'' {
    \partial 4
    \time 12/8
    \key d \major
    \tempo 4. = 80
    a8 a |
    <<
      \new Voice = "melody"
      { \voiceOne 
        d[ d cis] d[ d e] fis4. \tweak Y-offset #0 r8 \tuplet 3/2 {b,8 b b} |
        e4 dis8 e[ e fis] g4. \tweak Y-offset #0 r |
      }
      \new Voice { \voiceTwo
        <fis, a>1. |
        <b g cis,>1. |
      }
    >>
    <<
      { \voiceOne 
        \bbarre #"II" { fis'8 fis g a4. } e8 e fis g4. |
        fis4-3 g8-4 a4-4 fis8 \tuplet 3/2 { a[ e e~] } e \tweak Y-offset #0 r4 \fermata d8 |
      }
      \new Voice { \voiceTwo
        <a d,~>8 <a~ d,> <a d,> fis4. <g b,~>8 <g~ b,> <g b,> cis,4. |
        d8[ d b-2] cis-2 a r g4.-2 s4. |
      }
    >>
    <<
      { \voiceOne 
        b''4 d,8 b'4. \tweak Y-offset #0 r4. \tweak Y-offset #0 r4 cis8 |
        \fbarre #"II" {<a cis,>4 d,8 fis4.} \tweak Y-offset #0 r4. \tweak Y-offset #0 r4 b,8 |
      }
      \new Voice { \voiceTwo
        e,,1. |
        fis1. |
      }
    >>
    \oneVoice
    <<
      { \voiceOne 
        g''4-3 fis8-2 e4 d8-2 e8 d8 cis8 \tweak Y-offset #0 r4 a8  |
      }
      \new Voice { \voiceTwo
        b,2. <cis~ g'>4 <cis a'>8 s4. |
      }
    >>
    <<
      { \voiceOne 
        d'4 cis8 d4 cis8 d e fis~ fis4 b,8 |
        e4 d8 e4 fis8-2 g4.-3 r4 a,8 |
      }
      \new Voice { \voiceTwo
        fis8[ d a'] fis[ d a'] fis[ a d] fis,[ d] r |
        g[ a fis] g[ a d,] g[ a cis] b[ cis] r |
      }
    >>
    <<
      { \voiceOne 
        cis4 b8 cis4 b8 cis4 d8 e4 cis8 |
        d4 cis8~ cis[ d8 e ] fis4.~ fis8~ fis8 d8 |
      }
      \new Voice { \voiceTwo
        a,8[ b g] a8[ b gis] a b4 a8 cis4 |
        <fis' a, d,>2. <a d, d,> |
      }
    >>
    <<
      { \voiceOne 
        b4 a8 r8 b cis a d, fis~ fis4 d8 |
        g4 fis8 r g a fis4. \tweak Y-offset #0 r4 b,8 |
      }
      \new Voice { \voiceTwo
        g2. fis |
        e d |
      }
    >>
    <<
      { \voiceOne 
        b''4 a8 b4 cis8 <a d,>4 d,8 fis4 g,8 |
        g'4 fis8 r e[ d] cis2. |
      }
      \new Voice { \voiceTwo
        <a g>2. <d, a> |
        r2 g,4 a2. |
      }
    >>
    <<
      { \voiceOne 
        d'4 e8 fis4 d8 e4 fis8 g4 r8 |
        fis4 g8 \grace g16 \glissando a4 fis8 \tuplet 3/2 {a (e) e~} e4. \fermata d8 |
      }
      \new Voice { \voiceTwo
        s1. s
      }
    >>
    \oneVoice 
    <<
      { \voiceOne 
        b'8[ b a] g4. \tweak Y-offset #0 r2. |
        a8[ g fis~] fis4. \tweak Y-offset #0 r2 \tuplet 3/2 { b,8[ b b] } |
      }
      \new Voice { \voiceTwo
        g2. s |
        fis2. s |
      }
    >>
    <<
      { \voiceOne 
        g'8[ fis e~] e4 d8  cis2. \fermata |
      }
      \new Voice { \voiceTwo
        e,2. a2 \fermata a,8 a |
      }
    >>
    <<
      { \voiceOne 
        \fbarre #"II" { <a' fis'>4 <a fis'>4 <a fis'>2 } r2 |
        <b g'-3>4 <b g'-2>4 <cis a'>2 \tweak Y-offset #0 r2 |
      }
      \new Voice { \voiceTwo
        d,8[ cis d] e fis4~ fis4 r b,8 b |
        e-2[ dis-1 e-1] fis-3 g4~ g s2 |
      }
    >>
    <<
      { \voiceOne
        d'8 d b cis4. r8 b4 \grace { cis16 d } cis4 s8 |
        d8 d e <cis fis>4. <b g'> <cis e> |
      }
      \new Voice { \voiceTwo
        fis,4 g8 \fbarre #"II" {a8 fis4 e4} fis8 g4 \tweak Y-offset #0 r8 |
        fis4 g8 a4 fis8 e8[ fis8 g8~] g4 d8 |
      }
    >>
    <<
      { \voiceOne
        \set stringNumberOrientations = #'(up)
        <e' g>2. <cis fis> |
        <b e>4. <g b e> <a cis>8 <g b> <e a>~ <e a>4. |
      }
      \new Voice { \voiceTwo
        \set stringNumberOrientations = #'(down)
        b'8[ b b~] b4 b8 a d, fis4. g,8 |
        g'4 fis8 e4 d8 e[ d cis~] cis4 a8 |
      }
    >>
    <<
      { \voiceOne
        fis''8 [ d a'] fis8 [ d a'] fis8 [ d a'] fis8 [ d] r |
        g8[ a fis] g8[ a fis] g8[ a fis] g8[ a]  r |
      }
      \new Voice { \voiceTwo
        d,,4 cis8 d4 cis8 d4 \fbarre #"II" {e8 fis4 b,8} |
        e4 dis8 e4 dis8 e4 fis8 g4 d8 |
      }
    >>
    <<
      { \voiceTwo 
        <d'' e,,,>2.  <fis, g,,>2 s4 |
        d,4. d d d |
      }
      \new Voice { \voiceOne
        b'4 a8 b4 cis8 a4 d,8 fis4 g,8  |
        <g' d>4 fis8 <g d>4 a8 fis4 a,8 d4 b8 |
      }
    >>
    <<
      { \voiceOne
        <g'' e,>4. <g e,> <g e,> <a d,,> |
        s1. |
        <b, e>4. <b e> r2. \fermata |
      }
      \new Voice { \voiceTwo
        b4 a8 b4 a8 b4 cis8 <d a>8 a4~ |
        a2. \tweak Y-offset #0 r4. e8[(fis)] g~  |
        g8 fis8 e4 cis8a'8 e2. \fermata |
      }
    >>
    <<
      { \voiceOne 
        d'4 cis8 d4 cis8 d e fis2 |
        e4 dis8 e4 dis8 e fis-3 g4.-4 a,8 |
      }
      \new Voice { \voiceTwo
        s1. |
        cis,4. dis4. g8[ a-1 cis-2] b[ cis a] |
      }
    >>
    <<
      { \voiceOne 
        <cis a>4 <b g>8 <cis a>4 <b g>8 <cis a>4 <d b>8 <e cis>4 a,8 |
        \fbarre #"II" { d4 cis8 d4 cis8 d8 d e } fis4\2 d8 |
      }
      \new Voice { \voiceTwo
        g,,2. r |
        <d' fis a>2. <fis, b a'>4. r4. |
      }
    >>
    <<
      { \voiceOne 
        b''4 a8 b4 cis8 a4 d,8 fis4 g,8 |
        g'4 fis8 g4 a8 fis4 a,8 d4 <b-3\4>8 |
      }
      \new Voice { \voiceTwo
        g2. fis |
        e d |
      }
    >>
    <<
      { \voiceOne 
        \fbarre #"VII" { b''4 a8 b4 cis8 } a4 d,8 fis4 e8 |
        g4 fis8 e4 d8 e[ d cis~] cis8 \fermata a[ a] |
      }
      \new Voice { \voiceTwo
        <e e' g>2. <a, fis' d'> |
        b' <cis e>8 <b e> <a~ cis> a8 s4 |
      }
    >>
    <<
      \time 4/4
  \key d \major
      { \voiceOne 
  d8 cis d cis d e fis d |
  e d e fis g4. a,8 |
  cis8 b cis b cis d e a, |
  d cis d cis d e fis4 \bar "|."
      }
    >>
  }
>>
\version "2.18.2"
\header {
  title = "Orange Wishing Tree"
  subtitle = "draft 2"
  composer = "John Asmuth"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

#(set-global-staff-size 23)
 <<
  \relative d'' {
    \partial 4
    \time 6/4
    \key d \major
  
    a8 a |
    <<
      \new Voice = "melody"
      { \voiceOne 
        d[ d cis] d[ d e] fis4. r8 \tuplet 3/2 {b,8 b b} |
        e4 dis8 e[ e fis] g4. r |
      }
      \new Voice { \voiceTwo
        <fis, a>1. |
        <b g cis,>1. |
      }
    >>
    <<
      { \voiceOne 
        fis'8-2 fis g-2 a4. e8 e fis g4. |
        fis4-3 g8-4 a4-4 fis8 \tuplet 3/2 { a[ e e~] } e r4 \fermata d8 |
      }
      \new Voice { \voiceTwo
        <d a~>8 <d a> a fis4. <b g~>8 <b g> g cis,4. |
        d8[ d b-2] cis-2 a r g4.-2 r4 \fermata r8 |
      }
    >>
    <<
      { \voiceOne 
        b''4 d,8 b'4. r4. r4 cis8 |
        \fbarre #"II" {a4 d,8 fis4.} r4. r4 b,8 |
      }
      \new Voice { \voiceTwo
        e,,1. |
        fis1. |
      }
    >>
    \oneVoice
    <<
      { \voiceOne 
        g''4-3 fis8-2 e4 d8-2 e8 d8 cis8 r4 a8  |
      }
      \new Voice { \voiceTwo
        b,2. cis8 g' a r4. |
      }
    >>
    <<
      { \voiceOne 
        d4\RH#4 cis8\RH#3 d4 cis8 d\RH#4 e\RH#3 fis~\RH#2 fis4 b,8 |
        e4 d8 e4 fis8-2 g4.-3 r4 a,8 |
      }
      \new Voice { \voiceTwo
        fis8[ d a'] fis[ d a'] fis[ e a] fis[ d] r |
        g[ a fis] g[ a fis-4] g[ a cis] b[ cis] r |
      }
    >>
    <<
      { \voiceOne 
        cis4 b8 cis4 b8 cis4 d8 e4 cis8 |
        d4 cis d8[ e ] fis2~ fis8 d8 |
      }
      \new Voice { \voiceTwo
        a,8[ b g] a8[ b gis] a[ b gis] a[ cis] r |
        <fis' a, d,>2. <a d, d,> |
      }
    >>
    <<
      { \voiceOne 
        b4 a8 r8 b cis a d, fis~ fis4 d8 |
        g4 fis8 r g a fis4. r4 b,8 |
      }
      \new Voice { \voiceTwo
        g2. fis |
        e d |
      }
    >>
    <<
      { \voiceOne 
        b''4 a8 b4 cis8 <a d,>4 d,8 fis4 g,8 |
        g'4 fis8 r e[ d cis~] cis4. r4 |
      }
      \new Voice { \voiceTwo
        <b a g>2. <d, a> |
        r2 g,4 a2. |
      }
    >>
    <<
      { \voiceOne 
        d'4 e8 fis4 d8 e4 fis8 g4 r8 |
        fis4 g8 \grace g16 \glissando a4 fis8 \tuplet 3/2 {a (e) e~} e4. \fermata d8 |
      }
      \new Voice { \voiceTwo
        r1. r
      }
    >>
    \oneVoice 
    <<
      { \voiceOne 
        b'8[ b a] g4. r2. |
        a8[ g fis~] fis4.  r2 \tuplet 3/2 { b,8[ b b] } |
      }
      \new Voice { \voiceTwo
        g2. r |
        fis2. r |
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
        <b g'-3>4 <b g'-2>4 <cis a'>2 r2 |
      }
      \new Voice { \voiceTwo
        d,8[ cis d] e fis4~ fis4 r b,8 b |
        e-2[ dis-1 e-1] fis-3 g4~ g r2 |
      }
    >>
    <<
      { \voiceOne
        \fbarre #"VII" { <d'' fis, d>4. <cis fis, d> <b g d>2. } |
        \fbarre #"VII" { <d fis, d>4. <cis fis, d> <b g d>2. } |
      }
      \new Voice { \voiceTwo
        fis,4 g8 a8 fis4 e4 fis8 g4 r8 |
        fis4 g8 a4 fis8 e8[ fis8 g8~] g4 d8 |
      }
    >>
    <<
      { \voiceOne
        \set stringNumberOrientations = #'(up)
        <e'\3 g\2>2. <d a'> |
        <b e>4. <g b e> <a cis>8 <g b> <e a>~ <e a>4. |
      }
      \new Voice { \voiceTwo
        \set stringNumberOrientations = #'(down)
        b'8\4[ b b~] b4 b8-0 a d, fis4. g,8 |
        g'4 fis8 e4 d8 e[ d cis~] cis4 a8 |
      }
    >>
    <<
      { \voiceOne
        e''8\RH #4 [ fis-1 \RH #3 d-2] \RH #2 e[ fis d] e[ fis-2 d-3] e[ fis-2] r |
        fis8-3[ g-4 e] fis[ g e] fis-2[ g-3 e] fis[ g] r |
      }
      \new Voice { \voiceTwo
        d,4 cis8-3 d4 cis8 d4 e8-1 fis4-4 b,8-1 |
        e4-2 dis8 e4 dis8-1 e4-1 fis8-4 g4 d8 |
      }
    >>
    <<
      { \voiceTwo 
        <d'' e,,,>2.  <fis, g,,>2 r4 |
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
        r1 r8 g4. |
        <b, e>4. <b e> r2. \fermata |
      }
      \new Voice { \voiceTwo
        b4 a8 b4 a8 b4 cis8 <d a>8 a4~ |
        a2. r4 r8 e8[(fis)] g~  |
        g8 fis8 e4 cis8a'8 e2. \fermata |
      }
    >>
    <<
      { \voiceOne 
        d'4 cis8 d4 cis8 d e fis2 |
        e4 dis8 e4 dis8 e fis-3 g4.-4 a,8 |
      }
      \new Voice { \voiceTwo
        r1. |
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
        g'4 fis8 g4 a8 fis4 a,8 d4 b8 |
      }
      \new Voice { \voiceTwo
        g2. fis |
        e d |
      }
    >>
    <<
      { \voiceOne 
        \fbarre #"VII" { b''4 a8 b4 cis8 } a4 d,8 fis4 e8 |
        g4 fis8 e4 d8 e[ d cis~] cis4. |
      }
      \new Voice { \voiceTwo
        <e, b e' g>2. <a, fis' a d> |
        b' <cis e>8 <b e> <a~ cis> a4. |
      }
    >>
  }
>>
{
  \time 4/4
  \key d \major
  \partial 4
  a'8 a' |
  d''8 cis'' d'' cis'' d'' e'' fis'' d'' |
  e'' d'' e'' fis'' g''4. a'8 |
  cis''8 b' cis'' b' cis'' d'' e'' a' |
  d'' cis'' d'' cis'' d'' e'' fis''4
  \bar "|."
}
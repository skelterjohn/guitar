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
        \set fingeringOrientations = #'(left)
        <f'-2>8 <e'-1> f'8\RH1 g'\RH2 b'\RH3 e''\RH4 g'\RH3 <c'-2\RH1> <e'-1\RH2> <g'-4\RH3> <g'-0\RH2> e''\RH4 |
        \fbarre #"I" { d''\RH3 bes\RH1 f'\RH2 gis'\RH3 d''\RH2 f''\RH4 } e''\RH3-"rit." e' g' c'' g'4 | \break
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
        f'8 e' f'8 g' b' e'' g' c' e' g' g' e'' |
        d'' bes f' gis' d'' f'' e''-"rit." gis f' b' f'4 | \break
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
        a'8\RH3 f\RH1 c'\RH2 d'\RH3 a'\RH2 b'\RH4 c''\RH3 a\RH1 e'\RH2 g'\RH3 c''\RH2 e''\RH4 |
        d''\RH3 b\RH1 e'\RH2 gis'\RH3 d''\RH4 e''\RH3 <d' gis' f''>2 e''4 | \break
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
        \set fingeringOrientations = #'(left)
        \fbarre #"V" {a''8[ d' a' d'' } \tuplet 3/4 {<b d'' f''>] <cis' b' e''> <d' g' d''>[} d' g' b' d''] |
        r8 <cis'' g''-2>4 <cis'' g''>4 <cis'' g''>8 <e'-1 bes'-3 cis''-1>2 d''8 e'' | \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        a''4 s4 \tuplet 3/4 {b8 cis' <d'>} s2 |
        \bbarre #"II" { <e'>4 <d'-0> <cis'-4> e'2 } s4 |
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
        \set fingeringOrientations = #'(left)
        \bbarre #"I" { f''8\RH4 d'\RH1 gis'\RH2 c''\RH3 f''\RH4 c''\RH3 g'' d' a' c'' g'' c'' } |
        <g''-4> <e'-1> <bes'-3> <cis''-2> g'' cis'' a''2. | \break
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
        \fbarre #"II" { e'4 d' cis' e'2 } s4|
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
        \bbarre #"I" { f''8\RH4 d'\RH1 gis'\RH2 c''\RH3 f''\RH4 c''\RH2 } <g\RH1 b'\RH3> d'\RH2 f'\RH1 g'\RH2 b'\RH3 e''\RH4 |
        c''\RH3 c'\RH1 e'\RH2 g'\RH3 c''\RH2 e''\RH4 c''2.\RH3 \bar ":|.|:" \break
      }
      \new Voice { \voiceTwo
        f''4 s2 <g>4 s2 |
        c''4 s2 c''2.-"Fine" |
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
        c'''8 c''\3 d''\3 fis''\2 d'\4 e' <d' b' fis''>4 c' <b e''> |
        c'''8 c'' d'' fis'' d' e' <d' b' fis''>2 c'4 \bar ":|.|:" \break
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
        e'8 fis' g' b' g' b' a' f d' a' b' c'' |
        a' a e' a' b' c'' b'4 <f c' e' a'>2 \bar ":|." \break
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
        e''8 f'' g'' e'' a'' e'' f''4  d'''8 e'' e'' c''' |
        b''4 g'8 a' b' d'' c'' a'4 s4. \bar "[|:" \break
      }
      \new Voice { \voiceTwo
        s4 cis' b a <e' bes'> <c' a'>  |
        <d' gis'>4 s4 b'4 s4. s4.  |
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
        \time 8/4
        <e' gis' dis''>4 e'8 gis' dis''8 b' dis'' fis''4 a''4 b''4 c'''4 s8 \bar ":|."
        <e' gis' dis''>4 e'8 gis' dis'' b' r g' a' b' fis'' e'' b'4 <e' c'' fis''> | \break
      }
      \new Voice { \voiceTwo
        <e' gis'>4 s2 s8 r8 g'4 g' g' g'4 |
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
        \time 11/8
        \set fingeringOrientations = #'(left)
        dis'8 e' f'' b' <c''-2> <f-1 a'-3> e' a' c'' e''   c''| \break
      }
      \new Voice { \voiceTwo
        |
      }
      \new Voice { \voiceThree
        |
      }
      \new Voice { \voiceFour
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        \time 6/4
        g' a' <e' g' b'> e'' <g g'> b' <gis c''> b' <g g' b'> g' <f e' a'>4 \bar ".|:"
        \time 15/8
        \fbarre #"III" { c'8 d' f' bes' f'' e'' d'' } <e'' a''>4 <d'' g''> <b' e''> <e'-1 a'-1>8 \bar ":|." \break
      }
      \new Voice { \voiceTwo
        s 1. |
        s2 s4. r8 g'4 f' d' s8 |
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
        \time 10/4
        r8 c'8 d' f' bes' f'' e'' d'' <c'' e''> <c'' e''> c''' c''' <d'' fis''> <d'' fis''> d''' d''' <e'' gis''> <e'' gis''> e''' e''' \bar ".|:" 
        \time 6/4
        r8 f'' fis'' gis'' d''' cis''' a'' g'' e'''16 e''' e'''8 e''' r8 \bar ":|." \break
      }
      \new Voice { \voiceTwo
        s1 <c'' e''>8 <c'' e''>8 s4  <d'' fis''>8  <d'' fis''>8 s4 <e'' gis''>8 <e'' gis''>8 s4 |
        s2. s8 g''4 s4.|
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
        \time 8/4
        f'8 g' a' d'' b' g' dis' g'16 g' g'8 d'' dis' g'16 g' g'8 d'' cis'' a' |
        a''4 f'' ais'' e'' r1-"D.C. al Fine" \bar ":|]" \break  
      }
      \new Voice { \voiceTwo
        s4 <g a'> s <g dis'> s  <g dis'> s4 cis''4 |
        d'2 a2 a4 cis'2 e'4 |
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
\version "2.18.2"
\header {
  title = "Prelude No. 1"
  composer = "Francisco Burgos"
  arranger = "Arr. John Asmuth"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

<<
  {
    \time 6/4
    \key c \major
   
    <<
      \new Voice { \voiceOne
        \bar ".|:"
        \set fingeringOrientations = #'(left)
        <f'-2>8 <e'-1> f'8 g' b' e'' g' <c'-2> <e'-1> <g'-4> <g'-0> e'' |
        \fbarre #"I" { d'' bes f' gis' d'' f'' } e''-"rit." e' g' c'' g'4 | \break
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
        a'8 f c' d' a' b' c'' a e' g' c'' e'' |
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
        \set fingeringOrientations = #'(left)
        \fbarre #"V" {a''8[ d' a' d'' } \tuplet 3/4 {<b-3 d'' f''>-"C V"] <cis' b' e''>-"C IV" <d'-0 g'-0 d''-2>[} d' g' b' <d''-4>] |
        r8 <cis'' g''-2>8 r <cis'' g''> r <cis'' g''>8 <e'-1 bes'-3 cis''-1>2 d''8 e'' | \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(down)
        a''4 s4 \tuplet 3/4 {b8 cis' <d'>} s2 |
        \bbarre #"II" { <e'>4 <d'-4\5> <cis'-4> e'2 } s4 |
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
        \bbarre #"I" { f''8 d' gis' c'' f'' c'' g'' d' a' c'' g'' c'' } |
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
        r8 <cis'' g''>8 r <cis'' g''> r <cis'' g''>8 <e' bes' cis''>2 d''8 e'' | \break
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
        \set strokeFingerOrientations = #'(up)
        \bbarre #"I" { f''8 d' gis' c'' f'' c'' } <g b'\RH4> d' f' g' b' e'' |
        c'' c' e' g' c'' e'' c''2. \bar ":|.|:" \break
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
    
    \pageBreak
    
    <<
      \new Voice { \voiceOne
        c'''8 c''\3 <d''\3> <fis''\2>4.  <b' fis''>2 <e''>4 |
        c'''8 c'' d'' <fis''>4. <b' fis''>2 c'4 \bar ":|.|:" \break
      }
      \new Voice { \voiceTwo
        \set stringNumberOrientations = #'(down)
        \set fingeringOrientations = #'(left)
        c'''4 s4 <d'-0>8 e' d'4 c' b |
        c'''4 s4 <d'>8 e' d'2 c'4 |
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
        <e'-2>8 <fis'-4> g' b' g' b' <a'-3> <f-1> d' a' b' <c''-1> |
        a' a <e'-2> a' b' c'' b'4 <f c' e' a'>2 \bar ":|." \break
      }
      \new Voice { \voiceTwo
        s2. a'4 s2 |
        a'4 s2. <f c'>2 |
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
        e''8 <f''-1> <g''-1> <e''-0> <a''-1> <e''-0> <f''-1\2>4  d'''8 e'' e'' c''' |
        b''8 <e''-0> <g'-0>8 <a'-3\4> <b'-0> <d''-4\3> <c''-1> a'4 s4. \bar "[|:" \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        s4 <cis'-3> <b-4> a <e' bes'> <c' a'>  |
        <d' gis'>4 g'4 b'4 s4. s4.  |
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
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        \set strokeFingerOrientations = #'(down)
        <e'\5-2 gis'\4-1 dis''\3-3>4 <e'\RH1>8 <gis'\RH1> <dis''\RH2> <b'-0\RH3> <dis''\RH1> <fis''\2-2>4 <a''-1>4 <b''-3>4 <c'''-4>4 s8 \bar ":|."
        <e' gis' dis''>4 e'8 gis' dis'' b' r g' a' b' fis'' e'' b'4 <e' c'' fis''> | \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        <e' gis'>4 s2 s8 r8 <g'-0>4 g' g' g'4 |
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
        <dis'-2>8[ <e'-3>] <f''-1>[ b'] <c''-2> <f-1 a'-4>[ e'] a'[ c''] e''[ c''] | \break
      }
      \new Voice { \voiceTwo
        s2 s8 <f>4 s2 |
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
        \set fingeringOrientations = #'(left)
        g'8 <a'-3> <e'-2 g' b'> e'' <g-1 g'-0> <b'-0> <gis-1 gis'-3 c''-2> <b'-0> <g-1 g'-3 b'-2 b'-0>-"rit." <g'-0> <f e' a'>4 \bar ".|:"
        \time 15/8
        \fbarre #"III" { c'8 d' f' bes' f'' e'' d'' } <e'' a''>4 <d'' g''> <b' e''> <e'-1 a'-1>8 \bar ":|." \break
      }
      \new Voice { \voiceTwo
        s4 <e'>4 g4 gis4 g4 s4 |
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
        \set fingeringOrientations = #'(left)
        \time 7/8
        <c'-2>8[ <d'-4>] \fbarre #"III" { f'[ bes'] f''[ e'' d''] }
        \time 7/4
        \bbarre #"V" { <c'' e''> <c'' e''> c''' c''' } \bbarre #"VII" { <d'' fis''> <d'' fis''> d''' d''' } \bbarre #"IX" { <e'' gis''> <e'' gis''> e''' e''' r4 } \bar ".|:" 
        \time 5/4
        <f''>8-\markup { "IX" } fis'' <gis''> <d'''> cis''' <a''> <g''> e'''16 e''' e'''8 e''' \bar ":|." \break
      }
      \new Voice { \voiceTwo
        s2 s4. | <c'' e''>8 <c'' e''>8 s4  <d'' fis''>8  <d'' fis''>8 s4 <e'' gis''>8 <e'' gis''>8 s2 |
        s2 s4 g''4 s4  |
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
        \set fingeringOrientations = #'(left)
        <f'-4>8 g' a' d'' b' g' dis' g'16 g' g'8 d'' dis' g'16 g' g'8 d'' cis'' a' |
        r8-"rit." a''4 f''8~ f'' ais''4 e''8~ e''2-"D.C. al Fine" r2 \bar ":|]" \break  
      }
      \new Voice { \voiceTwo
        \set stringNumberOrientations = #'(down)
        s4 <g a'> s <g dis'> s  <g dis'> s4 cis''4 |
        d'2 a2 a4 cis'2 e'4\5 |
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
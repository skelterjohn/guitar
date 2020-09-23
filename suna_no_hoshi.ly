\version "2.18.2"
\header {
  title = "Suna no Hoshi"
  subtitle = "Sandy Planet"
  composer = "Tsuneo Imahori"
  arranger = "Arr. John Asmuth"
  piece = \markup { \line { \circle 6 "= D" } }
  
}

\include "bbarred.ly"
#(define RH rightHandFinger)

\score {
<<
\new Staff {
  \time 3/4
  \clef "treble"
 
  \key d \major
 
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
      
      <fis''\2 d''\3>8 <e'' cis''> <g''\2 b'\4>2 | <fis'' d''>8 <e'' cis''> <g'' b'>2 |
      r8 a'\harmonic d''\harmonic fis''\3 cis''\4 a''\2 | g''4 d'''2 |
      e''2. | d''4 \harmonic g''\harmonic r |
      
      <fis'' d''>8 <e'' cis''> <g'' b'>2 | <fis'' d''>8 <e'' cis''> <g'' b'>2 |
      r8 a'\harmonic d''\harmonic fis'' cis'' \glissando a' | <b'>2.  |
      b'2. | <d''-4\3 a'-3\4>4 <e''-0> <fis''-2 fis'-4> |
      fis''2 fis''4 |
      
      b''4 s2 | r4 e'' cis''' |
      a''2 <e''-0>4 |  <a'-2>2 <a'-1>4 |
      <g'-4>4  <g'-0> <g'-0 fis'-3>4 | <g'-0 e'-1>4 <b' dis'> <g'' d'> |
      g''2. | g'4 bes' c'' |
      
      <cis'' a'>4 e''2 | <cis'' a'>4 e''2 |
      <d''-1 b'-2>4 <e''-0 b'-0> <fis''-2 d''-3> | <g''-4 d''-3> <fis''-2> \grace { g''8 (fis'') } e''4 |
      <d'' b'>4 r <d'''-4> \glissando | <b''>4 r d''8 e'' |
      
      <fis'' d''>4 \glissando <a'' fis''> <g'' e''> | <fis'' d''> r <e'' cis''> | d''2 s4 | fis'2. \fermata |
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(down)

      d2. | d2. |
      d2. | b'2 fis''4 |
      g2. | s2. |
      
      d2. | d2. |
      d'2. \harmonic | <g-1>2.  |
      g2. |  fis4 e d |
      ais2. |
      
      <g'\4>2. | s2. |
      <g'-0>2. | 
      s2 <cis'-3>4 |
      <b-1 e-1>2. | s2. |
      dis2. | <f' dis>2. |
      
      d8 \staccato \tweak Y-offset #-6 r4 d4. | d8 \staccato \tweak Y-offset #-6 r4 d4. |
      a4 <g-3>8 a4 a8 | <ais-1>4. ais4 \grace a \glissando <b-1>8 |
      s2 <b'-0>4 | <g'-0> s2 |
      
      r8 a4 a4 a8~ | a8 a4 a4 a8 | d2. | s2. |
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
      
      s2. | s2. |
      s2. | s2. |
      g'4 d' g' | s2. |
      
      s2. | s2. |
      s2. | \tweak Y-offset #-2.2 r4 <g'-0 d'-0> <cis''-2\3 a'-3\4> |
      \tweak Y-offset #-2.2 r4 <g' d'> <cis'' a'> | s2. |
      \tweak Y-offset #-1.2 r4 bes'2 |
      
      s2. | s2. |
      s2. | s2. |
      s2. | s2. |
      s2. | s2. |
      
      s2. | s2. |
      s2. | s2. |
      s2. | s2. |
      
      s2. | s2. |
      s2. | s2. |
      
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      s2. | \tweak Y-offset #-1 r2 <g'-0>4 |
      s2. | s2. |
      s2. | s2. |
      
      s2. | s2. |
      s2. | s2. |
      s2. | s2. |
      s2. | 
        
      \tweak Y-offset #1.2 r4 <fis''-3 e''-0> <fis'' d''-2> | <fis'' cis''>2. |
      \tweak Y-offset #.6 r4 <cis''-1>2 | s2. |
      s2. | s2. |
      \tweak Y-offset #-1 r4 <g' f'> <g' f'> | s2. |
      
      s2. | s2. |
      s2. | s2. | 
      s2. | s2. | 
      
      s2. | s2. |
      \tweak Y-offset #-2 r4 <g'-4\4>8 a' d''4 | s2. |
      
    }
  >>
}
>>

}
\version "2.18.2"
\header {
  title = "Memory"
  composer = "Yoko Kanno"
  arranger = "Arr. John Asmuth"
  
  piece = \markup { \line { \circle 6 \circle 5 "= D G" } }
}

\include "bbarred.ly"
#(define RH rightHandFinger)

\score {
<<
\new Staff {
  \time 3/4
  \clef "treble"
 
  \key e \minor
 
  \partial 1
 
  b'4
 
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \bar ".|:"
      
      d''2 b'4 | d'2 b'4 | d''2 b'4 | \fbarre #"III" { \tuplet 3/2 { d''4 f'' d'' } bes'4 } |
      \break
      a'2. | r2. | r4 \tuplet 3/2 { a' a' g' } | \tuplet 4/3 { a' c'' a' g' } |
      \break
      d'4 bes c' | d'2. | r4 \tuplet 3/2 { d' f' g' } | gis'8 bes' g'4 f' |
      \break
      bes'2 g'4 | bes2 \tuplet 3/2 { cis'8 c'4 } | bes2. |
      
      \time 5/4
      
      fis'4 g' e' f' b'
      
      \bar ":|."
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(down)
      
      <d c'>2. | fis2. | <d g e'>2. | <f aes>2. |
      <d g d'>2. | dis2. | <e bes d'>2. | r2. |
      <bes>2. | <fis a>2. | <d gis>2. |  <cis' f>4 d'2  |
      <f c'~>4. <e c'> | dis2. | d2. |
      
      e'4 ees' d' des'
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
    }
  >>
  
}
>>

}
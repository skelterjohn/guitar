\version "2.18.2"
\header {
  title = "Rakuen"
  composer = "Tsuneo Imahori"
  arranger = "Arr. John Asmuth"
  piece = \markup { \line { \circle 1 "= D"  \circle 5 "= G" \circle 6 "= D" } }
}

\include "bbarred.ly"
#(define RH rightHandFinger)

<<
\new Staff \with {
  instrumentName = #"Voice"
  shortInstrumentName = #"V."
} {
  \new Voice { \voiceFour
    r1 | r1 | r1 | r1 | r1 |
    r1 | r1 | r1 | r1 | r1 |
    
    r1 | r1 | r1 | r1 |
    r1 | r1 | r1 | r1 |
    
    r4 d'8 a' b'4 a'8 c''8~ | c''2 r |
    r4 d'8 a' b'4 a'8 c''8~ | c''2 r |
  }
}

\new Staff \with {
  instrumentName = #"Guitar"
  shortInstrumentName = #"G."
} {
  {
    \time 4/4
    \clef "treble"
   
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        
        \key g \major
        
        <d''~ g' >1 | <d'' g' >2 <d'' g' >2 |
        <d''~ g' >1 | <d'' g' >2 <d'' g' >2 | 
        <d''~ g' >1 |  <d'' g'>2 <d'' g' >2 |
        <d''~ g' >1 |  <d'' g'>2 <d'' g' >2 |
        <d'' g' >1 |  <d'' g'>1 |
        
        \break
        
        g8 d' g' a' <b' fis'>8 c''16 (b') g'8 d' | c'8 d' g' c' d' g' b d' |
        g8 d' g' a' <b' fis'>16 (c'') d''8 g'8 d' | c'8 d' g' c' d' g' b d' |
        \grace f \glissando g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        
        \break
        
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        
        \break
      }
      \new Voice { \voiceFour
        \set fingeringOrientations = #'(left)
        
        \key g \major
        
        <e' g e>1 | <e' g e>2 <g e>2 |
        <d' g f>1 | < d' g f>2 < d' g>2 | 
        < d' g g>1 |  < d' g g>2 < d' g g>2 |
        < d' g f>1 |  < d' g f>2 < d' g f>2 |
        < d' g ees>1 |  < d' g f>1 |
        
        g4 s fis' s | c'4 s8 c'4 s8 b4 |
        g4 s fis' s | c'4 s8 c'4 s8 b4 |
        g4 s g s | d'4 s d' s | 
        g4 s g s | d'4 s d' s | 
        
        g4 s fis' s | s1 |
        g4 s fis' s | s1 |
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        
        \key g \major
        
        s1 | s2 <e'>4. (<d'>8) |
        s1 | s2 <f>4. \glissando <g>8 |
        s1 | s1 | s1 | s1 | s1 | s1 |
        
        
      }
    >>
    
  }
}
>>
\version "2.18.2"
\header {
  title = "Crush"
  composer = "Tessa Violet"
}

\include "bbarred.ly"
#(define RH rightHandFinger)
\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
<<
  {
    \time 4/4
    \key c \major
    
    \set Staff.connectArpeggios = ##t
   
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        
        \bar ".|:"
        
        r8 g' g' g' b' g' g' g' | g' g' g' b' r2 |
        r8 g' g' g' b' g' g' g' | g' g' g' d' r2 |
        \bar ":|."
        
        \break
        
        r4 r4 g'16 g' r8 g'16 g' r8 fis'16 fis' r8 fis'16 fis' r8 fis'4 e'8 d' |
        r4 r4 g'16 g' r8 g'16 g' r8 fis'16 fis' r8 fis'16 fis' r8 g'4  e'8 d' |
        
        \break
        
        r4 r4 g'16 g' r8 g'16 g' r8 fis'16 fis' r8 fis'16 fis' r8 fis'4 e'8 d' |
        g'4  e'8 d' r4 r4 | r2 g'8 g' g' g' |
        
        \break
        
        \bar ".|:"
        
        g'4 b' g'8 g' g' g' g'4 b' g'8 g' g' g' | 
        g'4 e'8 d'8 g'4 d'4 | g'8 g' g' g' g'4 d'4 |
        
        \bar ":|."
        
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(down)
        
        s1 s1 s1 s1 |
        s1 s1 s1 s1 |
        s1 s1 s1 s1 |
        g1 fis1 e1 c'1 |
      }
    >>    
  }
  \new TabStaff {
    \set Staff.stringTunings = \stringTuning <e a d' g' b' e''>
    << 
      {
        
        \bar ".|:"
        
        r8 g' g' g' b' g' g' g' | g' g' g' b' r2 |
        r8 g' g' g' b' g' g' g' | g' g' g' d' r2 |
        \bar ":|."
        
        \break
        
        r4 r4 g'16 g' r8 g'16 g' r8 fis'16 fis' r8 fis'16 fis' r8 fis'4 e'8 d' |
        r4 r4 g'16 g' r8 g'16 g' r8 fis'16 fis' r8 fis'16 fis' r8 g'4  e'8 d' |
        
        \break
        
        r4 r4 g'16 g' r8 g'16 g' r8 fis'16 fis' r8 fis'16 fis' r8 fis'4 e'8 d' |
        g'4  e'8 d' r4 r4 | r2 g'8 g' g' g' |
        
        \break
        
        g'4 b' g'8 g' g' g' g'4 b' g'8 g' g' g' | 
        g'4 e'8 d'8 g'4 d'4 | g'8 g' g' g' g'4 d'4 |
      }
      {
        
        s1 s1 s1 s1 |
        s1 s1 s1 s1 |
        s1 s1 s1 s1 |
        g1 fis1 e1 c'1 |
 
      }
    >>
  }
>>

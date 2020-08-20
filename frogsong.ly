\version "2.18.2"
\header {
  title = "Frog Song (Naked Man Dance)"
  composer = "John Asmuth"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

<<
  {
    \time 3/4
    \tempo "Adagio Quarantino"
   
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        
        \key g \major
        
        \bar ".|:" s2.\p | s2. | \bar ":|." 
        s4\mp c''8 d'' e'' g'' | fis''2 d''4 | e''2.-> | e''2.-> |
        \bar ".|:" s2.\p | s2. | \bar ":|." 
        s4\mp c''8 d'' e'' g'' | a''4 fis'' d'' | e''2.-> | e''2.-> |
        \bar ".|:" s2.\p | s2. | \bar ":|." 
        
        \key c \major
        
        d''2.\mf | b'2. | e''2. | s2. | 
        g''4 d''8 e'' g'4 | \fbarre #"III" { a''4 d''8 (e'') } g'4 | b'4 a' e'' | s4 b'8 (c'') d'' e'' | 
        g''4 d''8 e'' g'4 | \fbarre #"III" { <a''-4>4 d''8 e'' <g''> <a''-3> } | \bbarre #"V" { <b''-3>2.-> | b''2.-> } | 
        
        \bar ".|:" s2.\p | s2. | \bar ":|." 
        
        \key d \minor
        
        s4\ff f'' g'' | s4 a'' g'' | s4\>  f'' (e'') | s4 <bes'> <a'> \! |
        s4\< \fbarre #"III" { bes'8 (c'') d'' (f'') | s4 <e''>8 (f'') g'' (a'') | s4\! bes'' a'' } | s4 g'' f'' |
        s4 d''4 bes'4 | s4 a' g' | s4 \fbarre #"I" { a'8 (bes') c'' (d'') } | c''4 g' bes' |
        s4 d''8 e'' f'' (g'') | s4 \tweak Y-offset #2 r4 e''4 | s4 d''8 e'' f'' (g'') | s4 bes'4 a' |
        
        \key g \major
        
        \bar ".|:" s2.\p | s2. | \bar ":|." 
        
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        
        a2. | e2. | 
        a2. | e2. | a2. | e2. | 
        a2. | e2. | 
        a2. | e2. | a2. | e2. | 
        a2. | e2. | 
        
        f2. | g2. | c'2. | a2. |
        f2. | g2. | a2. | g2.\< | 
        f2. | g2. | <a'-2>2.\! | g'2. |
        a2. | e2. | 
        
        d'2. | a2. | d'2. | f2. |
        g2. | c'2. | f'2. | d'2. |
        bes2. | g2. | f2. | <a e'>2. | 
        d'2. | a2. | bes2. | f2. |
        
        a2. | e2. | 
      }
      \new Voice { \voiceFour
        \set fingeringOrientations = #'(left)
        
        \tweak Y-offset #0 r4 <g' c''>2 | \tweak Y-offset #0 r4 <e' g'>2 | 
        \tweak Y-offset #0 r4 <g'>2 | \tweak Y-offset #-1 r4 <e' g'>2 | \tweak Y-offset #-1 r4 <g' c''>2 | \tweak Y-offset #-1 r4 <e' g'>2 |
        \tweak Y-offset #0 r4 <g' c''>2 | \tweak Y-offset #0 r4 <e' g'>2 | 
        \tweak Y-offset #0 r4 <g'>2 | \tweak Y-offset #0 r4 <e' g'>2 | \tweak Y-offset #-1 r4 <g' c''>2 | \tweak Y-offset #-1 r4 <e' g'>2 |
        \tweak Y-offset #0 r4 <g' c''>2 | \tweak Y-offset #0 r4 <e' g'>2 | 
        
        \tweak Y-offset #-2 r4 <f' a'>2 | \tweak Y-offset #-2.5 r4 <d' g'>2 | \tweak Y-offset #-1 r4 <e' g'>2 | \tweak Y-offset #-0 r4 <g' c''>2 |
        \tweak Y-offset #0 r4 <f'>2 | \tweak Y-offset #0 r4 <f'>2 | \tweak Y-offset #-2 r4 <e'>2 | \tweak Y-offset #-0 r4 <g'>2 |
        \tweak Y-offset #-1 r4 <f'>2 | \tweak Y-offset #0 r4 <g'>2 | \tweak Y-offset #1 r4 <c'' g''-4>2 | \tweak Y-offset #1 r4 <d''-2 e''>2 |
        \tweak Y-offset #0 r4 <g' c''>2 | \tweak Y-offset #0 r4 <e' g'>2 | 
        
        \tweak Y-offset #0 r4 <bes'>2 | \tweak Y-offset #0 r4 <c'' e''>4 <bes' d''> | \tweak Y-offset #0 r4 <bes'>2 | \tweak Y-offset #0 r4  <d'> <c'> |
        \tweak Y-offset #0 r4 <d'>2 | \tweak Y-offset #0 r4 <bes'>2 | \tweak Y-offset #1 r4 <d''>4 c'' | \tweak Y-offset #0 r4  <bes'>4 a' |
        \tweak Y-offset #0 r4 <f'>4 d' | \tweak Y-offset #0 r4  <d'>4 e' | \tweak Y-offset #0 r4 <c'>2 | s2. |
        
        \tweak Y-offset #0 r4 bes'2 | \tweak Y-offset #0 r4  <g' a'>2 | \tweak Y-offset #0 r4 <f'>2 | \tweak Y-offset #0 r4 <d'>4 c' |
        
       
        \tweak Y-offset #0 r4 <g' c''>2 |  \mark "repeat, fade" \tweak Y-offset #0 r4 <e' g'>2 | 
      }
    >>
    
    
   
    
  }
>>
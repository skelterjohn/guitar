\version "2.18.2"
\header {
  title = "Rakuen"
  composer = "Tsuneo Imahori"
  arranger = "Arr. John Asmuth"
  piece = \markup { \line { \circle 1 "= D"  \circle 5 "= G" \circle 6 "= D" } }
  
}

\include "bbarred.ly"
#(define RH rightHandFinger)

\score {
<<

\new Staff \with {
  instrumentName = #"Voice"
  shortInstrumentName = #"V."

} {
  \tempo 4 = 92
  \new Voice = "song" { \voiceOne
    r1 | r1 | r1 | r1 | r1 |
    r1 | r1 | r1 | r1 | r1 |
    
    r1 | r1 | r1 | r1 |
    r1 | r1 | r1 | r1 |
    
    r4 g'8 a' b'4 (a'8) c''8~ | c''2 r |
    r4 g'8 a' b'4 (a'8) c''8~ | c''2 r |
    r4 g'8 a' b'4 (d''8) d''8~ d''8 e''8 c''4. b' |
    r4 b'4 a'8\staccato g'4 d'8~ d'2 r2  |
    
    r1 | r1 | r1 | r1 |
    
    r4 g'8 a' b'4 (a'8) c''8~ | c''2 r |
    r4 g'8 a' b'4 (a'8) c''8~ | c''2 r |
    r4 g'8 a' b'4 (d''8) d''8~ d''8 e''8 c''4. b' |
    r4 b'4 a'8\staccato g'4 d'8~ d'2 r2  |
    
    r1 | r1 | r1 | r1 |
    
    r4 d''8 d'' d''4 d''8 d''8~ d''8 d'' c''4 b' r |
    r4 d''8 d'' d''4 d''8 d''8~ d''8 e'' c''4 b' r |
    r4 d''8 d'' d''4 d''8 g''8~ g''8 fis'' e''4 d'' r |
    r4 d''8 d'' g''8 fis''4 e''8~ e''8 d''4 e'' d''4. |
  }
}

\new Lyrics \with { alignAboveContext = "staff" } {
  \lyricsto "song" {
    hmm mm mm mm
    hmm mm mm mm
    hmm mm mm mm mm mm mm
    hmm mm mm mm
    
    hmm mm mm mm
    hmm mm mm mm
    hmm mm mm mm mm mm mm
    hmm mm mm mm
    
    na na na na na na na na
    na na na na na na na na
    na na na na na na na na
    na na na na na na na na
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
        \break
        \grace f \glissando g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        \break
        
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        \break
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        \break
        
        g8 d' g' a' <b' fis'> c''16 (b') g'8 d' | c' d' g' c' d' g' b d' |
        g8 d' g' a' <b' fis'>16 (c''16) d''8 g'8 d' | c' d' g' c' d' g' b d' |
        \break
        
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        \break
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' <b' g'> g <a' g'>\staccato g' g e'~ | e' g' c'' d'' ees' g' c'' d'' |
        \break
        
        \grace f \glissando g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        \break
        
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        \break
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' d' d16 (fis) |
        g8 d' g' a'16 d'16 <b' g'>8 \staccato <a' fis'>4 <g' e'>8~ | <g' e'>4. <g' e'>2 s8 |
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
        g4 s fis' s | s1 |
        g4 s fis' s | s1 |
        
        g4 s fis' s | c'4 s8 c'4 s8 b4 |
        g4 s fis' s | c'4 s8 c'4 s8 b4 |
        
        g4 s fis' s | s1 |
        g4 s fis' s | s1 |
        g4 s fis' s | s1 |
        g4 s2 s8 e'4 | s8 s2.
        
        g4 s g s | d'4 s d' s | 
        g4 s g s | d'4 s d' s | 
        
        g4 s fis' s | s1 |
        g4 s fis' s | s1 |
        g4 s fis' s | s1 |
        g4 s2 s8 g8 | s8 s2.
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

}
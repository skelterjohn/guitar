\version "2.18.2"
\header {
  title = "Rakuen"
  composer = "Tsuneo Imahori"
  arranger = "Arr. John Asmuth"
  piece = \markup { \line { \circle 1 \circle 2 \circle 3 \circle 4 \circle 5 \circle 6 "= D A G D G D" } }
  
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
  \key g \major
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
    
    r1 | r1 | r1 | r2. d''4 |
    e''2 fis'' | fis''4. g''8~ g'' b'' (g'') (d'') |
    e''2 fis'' | fis''4. g''8~ g''4 d'' |
    e''2 fis'' | g''4 a''8 b''4 a''4 g''8 |
    g''2 fis'' | fis'' r |
    r1 |
    
    r1 | r1 | r1| r1 |
    r1 | r1 | r1| r1 |
    r1 | r1 | r1| r1 |
    
    d''4 d''8 d''4. d''8 d''~ | d''4 d''8 c''4 b'4. |
    r4 d''8 d'' d''4 d''8 d''8~ | d''4 e''8 c''4 b'4. |
    r4 d''8 d'' d''4 d''8 g''8~ | g''4 fis''8 e''4 d''4. |
    r4 d''8 d'' g'' fis''4 fis''8~ | fis''8 e''4 fis'' e''4. |
    
    r1 | r1 | r1 | r2. d''4 |
    e''2 fis'' | fis''4. g''8~ g'' b'' (g'') (d'') |
    e''2 fis'' | fis''4. g''8~ g''4 d'' |
    e''2 fis'' | g''4 a''8 b''4 a''4 g''8 |
    g''2 fis'' | g'' r4 d''4 |
    e''2 fis'' | fis''4. g''8~ g'' b'' (g'') (d'') |
    e''2 fis'' | fis''4. g''8~ g''4 d'' |
    e''2 fis'' | g''4 (a''8) b''4 a''4 g''8 |
    g''2 fis'' | g'' r |
    
    r4. d''4 d''4 c''16 b' | a'2 r |
    r4. c''4 c''4 b'16 a' | g'2 r |
    
    r1 | r1 | r1 | r1 | r1 |
    
    \bar "|."
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
    
    hal le -- e lu jah ha -- al le lu jah
    ha -- a -- a -- a -- a -- a hal le lu -- u jah
    
    la la la la la la la la
    la la la la la la la la
    la la la la la la la la
    la la la la la la la la
    
    hal le -- e lu jah ha -- al le lu jah
    ha -- a -- a -- a -- a -- a hal le lu -- u jah
    hal le -- e lu jah ha -- al le lu jah
    ha -- a le lu jah hal le lu -- u jah
    
    ah ah ah ah
    ah ah ah ah
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
        
        g8 d' g' a' <b' fis'>8 \tuplet 3/2 { c''16 (b') (a') } g'8 d' | c'8 d' g' c' d' g' b d' |
        g8 d' g' a' <b' fis'>16 (c'') <d''-0>8 g'8 d' | c'8 d' g' c' d' g' b d' |
        \break
        \grace { d (fis) } g8 d'\5 d'\4 g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        \break
        
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        \break
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        \break
        
        g8 d' g' a' <b' fis'> \tuplet 3/2 { c''16 (b') (a') } g'8 d' | c' d' g' c' d' g' b d' |
        g8 d' g' a' <b' fis'>16 (c''16) d''8 g'8 d' | c' d' g' c' d' g' b d' |
        \break
        
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        \break
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' <b' g'> g <a' g'>\staccato g' g e'~ | e' g' c'' d'' ees' g' c'' d'' |
        \break
        
        \grace { d (fis) } g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        \break
        
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
        \break
        g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' d' d16 (fis) |
        g8 d' g' a'16 d'16 <b'\3 g'\4>8 \staccato <a' fis'>4 <g' e'>8~ | <g' e'>4 r8 <g' e'>4. r4 |
        \break
        
        g8 d' g' a' <c''\3 a'\2> <d''\2 g'\3>4 d''8\1 | g8 d' g' a' <c'' a'>16 d' <d'' g'>4 d''8 |
        g8 d' g' a' <c'' a'> <d'' g'>4 d''8 | g8-\markup { "rit." } d' g' a' d''2 |
        
        \break
        
        <c'-4>8 <fis'-3> g' a' d fis' g' a' | <g-4> <b-3\5> d' g' a' g' d' b | 
        c'8 fis' g' a' d fis' g' a' | fis b fis' g' d'' g' fis' b | 
        c'8 fis' g' a' d fis' g' a' | g b d' g' d'' g' d' b | 
        c'8 fis' g' a' d fis' g' a' | fis fis' g' a' d'' a' g' fis' | 
        fis-\markup { "rit." } b fis' g' d''2 \fermata |
        \break
        
        g8 d' g' <a'-0> \grace <a'-1\3> \glissando b'4 <a'-0>8 (<c''-3>) |  f'8 g' c'' f' g' c'' e' d' |
        g8 d' g' a' \grace a' \glissando b'4 a'8 (c'') |  f'8 g' c'' f' g' c'' e' d' |
        \break
        g8 d' g' a' \grace a' \glissando b'4 d''8 d''8 | f'8 g' e'' c'' f' b' e' d' |
        g8 d' \grace a' <d''\1 (b')\2> d' <d''\1 a'\3> g' g e'~ | e' g' c'' d'' ees' g' c'' d'' |
        \break
        
        \grace { d (fis) }  g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        \break
        
        g8 d' g' a' d'' g' a' d'' | e' g' d'' c'' es' b' g' es' |
        g8 d' g' a' d'' g' a' d'' | e' g' d'' b' es' g' d'' g' |
        \break
        g8 d' g' a' fis' g' a' d'' c' g' a' fis' c' a' fis'4 |
        g8 d' g' a' <b' g'> <a' fis'>4 <g' e'>8~ | <g' e'>4 r8 <g' e'>4. r4 |
        \break
        
        g8 d' g' a' <c'' a'>8 <d'' g'>4 d''8 | g8 d' g' a' <c'' a'>8 <d'' g'>4 d''8 |
        g8 d' g' a' <c'' a'>8 <d'' g'>4 d''8 | g8-\markup { "rit." } d' g' a' d''2 \fermata |
        \break
        
        c'8 fis' g' a' d fis' g' a' | g b d' g' a' g' d' b | 
        c'8 fis' g' a' d fis' g' a' | fis b d' g' d'' g' d' b |
        \break
        c'8 fis' g' a' d fis' g' a' | g b d' g' d'' g' d' b | 
        c'8 fis' g' a' d fis' g' a' | fis fis' g' a' d'' a' g' fis' |
        \break
        c'8 fis' g' a' d fis' g' a' | g b d' g' a' g' d' b | 
        c'8 fis' g' a' d fis' g' a' | fis b fis' g' d'' g' fis' b | 
        \break
        c'8 fis' g' a' d fis' g' a' | g b d' g' d'' g' d' b | 
        c'8 fis' g' a' d fis' g' a' |
        \break
        
        g8 d' g' a' <b' fis'>8 \tuplet 3/2 { c''16 (b') (a') } g'8 d' | c'8 d' g' c' d' g' b d' |
        g8 d' g' a' <b' fis'>16 (c'') d''8 g'8 d' | c'8 d' g' c' d' g' b d' |
        \break
        g8 d' g' a' <b' fis'>8 \tuplet 3/2 { c''16 (b') (a') } g'8 d' | c'8 d' g' c' d' g' b d' |
        g8 d' g' a' <b' fis'>16 (c'') d''8 g'8 a \glissando | c'8 g' fis' g' d'' a' g' fis' |
        
        \break
        
        <d'' g'>2 <d'' g'>2 | <d'' g' g e'>1 \arpeggio |
        
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
        g4 s2 s8 e'4 s8 s2. |
        
        g4 s g s | d'4 s d' s | 
        g4 s g s | d'4 s d' s | 
        
        g4 s fis' s | s1 |
        g4 s fis' s | s1 |
        g4 s fis' s | s1 |
        g4 s2 s8 g8 | s2. s8  d16 (fis) |
        
        g4 s2. | g4 s2. | 
        g4 s2. | g4 s2. |
        
        c'4 s d s | g\6 s a' s |
        c' s d s | fis s2. |
        c'4 s d s | g s a' s |
        c' s d s | fis s2. |
        fis4 s2. |
        
        g4 s4 r8 d'8 d''4 | f'4 s8 f'4 s8 e'4 |
        g4 s4 r8 d'8 d''4 | f'4 s8 f'4 s8 e'4 |
        g4 s4 r8 d'4. | s4 e''8 c'' s8 b'4 s8 |
        g4 s2 g4 | s1 |
        
        g4 s g s | d'4 s d' s | 
        g4 s g s | d'4 s d' s | 
        
        g4 s f' s | e' s ees' s |
        g4 s f' s | e' s ees' s |
        g4 s fis' s | c' s c' s8  d16 (fis) |
        g4 s2. | s2 s4.  d16 (fis) |
        
        g4 s a'16[ d'] s4. | g4 s a'16[ d'] s4. |
        g4 s a'16[ d'] s4. | g4 s2. |
        
        c'4 s d s | g s a' s |
        c' s d s | fis s2. |
        c'4 s d s | g s a' s |
        c' s d s | fis s2. |
        c'4 s d s | g s a' s |
        c' s d s | fis s2. |
        c'4 s d s | g s a' s |
        c' s d s |
        
        g4 s fis' s | c'4 s8 c'4 s8 b4 |
        g4 s fis' s | c'4 s8 c'4 s8 b4 |
        g4 s fis' s | c'4 s8 c'4 s8 b4 |
        g4 s fis' s8 a8 | c'4 s2. |
        
        <d' g f>2 <d' g ees>2 |
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
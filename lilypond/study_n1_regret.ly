\version "2.18.2"
\header {
  title = "Study No. 1 (Regret)"
  composer = "John Asmuth"
  
}

\include "bbarred.ly"
#(define RH rightHandFinger)

\score {
<<
\new Staff \with {
  instrumentName = #"Guitar"
  shortInstrumentName = #"G."
} {
  {
    \time 3/4
    \clef "treble"
   
    <<
      \new Voice { \voiceOne
        
        \set fingeringOrientations = #'(left)
        
        \fbarre #"VII" { d'''8 e'' a'' b'' a'' e'' | c'''8 e'' a'' b'' a'' e'' } |
        c'''8 f'' a'' \fbarre #"VII" { b'' f'' a'' | b''8 e'' gis'' d''' e'' gis'' } |
        d'''8 f'' a'' e''' f'' a'' | e'''8 g'' ais'' f''' g'' ais'' |
        \fbarre #"IX" { f'''8 e'' a'' e''' a'' e'' } | d'''8 d'' g'' c''' g'' d'' |
        \bbarre #"V" {c'''8 c'' fis'' a'' fis'' c'' } | bes'' g' e'' a'' e'' bes'' |
        a''8 f' d'' g'' d'' a'' | g'' a' cis'' e'' cis'' a' |
        f'' g' d'' e'' d'' cis'' |f''8 a' d'' e'' a''4
        
        \bar "|."
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(down)
        e'2.\5 | e' |
        dis' | e' |
        f' | g' |
        cis'\6 | d'\5 |
        <dis'-2> | cis' |
        ais | <a-0> |
        ais | d' |
        
      }
      \new Voice { \voiceThree
        \set fingeringOrientations = #'(left)
        
        
      }
      \new Voice { \voiceFour
        \set fingeringOrientations = #'(left)
        s4 s8 b''4 s8 | s4 s8 b''4 s8 |
        s4 s8 b''4 s8 | s4 s8 d'''4 s8 |
        s4 s8 e'''4 s8 | s4 s8 f'''4 s8 |
        s4 s8 e'''4 s8 | s4 s8 c'''4 s8 |
        s4 s8 a''4 s8 |s4 s8 a''4 bes''8 |
        s4 s8 g''4 a''8 | s4 s8 e''4 s8 |
        s4 s8 e''4 cis''8 | s4 s2|
      }
    >>
    
  }
}
>>

}
\version "2.18.2"
\header {
  title = "Study No. 1 (Regret)"
  composer = "John Asmuth"
  
}

\include "bbarred.ly"
#(define RH rightHandFinger)
#(set-global-staff-size 25)

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
        
        \fbarre #"VII" { <d'''-4>8 <e''-2> <a''-3> <b''-1> a'' e'' | <c'''-2>8 <e''-3> <a''-4> <b''-1> a'' e'' } |
        <c'''-3>8 <dis''-4> <a''-2> \fbarre #"VII" { <b''-1> a'' dis'' | <b''-1>8 <e''-2> <gis''-3> <d'''-4> gis'' e'' } |
        <d'''-4>8 <f''-2> <a''-3> <e'''-4> a'' f'' | <e'''-4>8 <g''-3> <ais''-2> <f'''-4> ais'' g''  |
        \fbarre #"IX" { <f'''-4>8 <e''-1> <a''-2> <e'''-4> a'' e'' } | <d'''-4>8 <d''-2> <g''-3> <c'''-4> g'' d'' |
        \bbarre #"V" {<c'''-4>8 <c''-1> <fis''-3> <a''-1> fis'' c'' } | <bes''-4> <g'-0> <e''-2> <a''-3> e'' bes'' |
        <a''-4>8 <g'-0> <d''-2> <g''-3> d'' a'' | g'' a' cis'' e'' cis'' a' |
        <f''-2> <g'-0> <d''-4> <e''-0> d'' <cis''-3> | <f''-1>8 <a'-2> <d''-3> <e''-0> <a''-4>4
        
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
        <ais-1> | d' |
        
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
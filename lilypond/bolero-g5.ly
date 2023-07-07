\version "2.24.1"

\include "common.ly"

\header {
  title = "Boléro"
  composer = "Maurice Ravel"
  arranger = "arr. Roland Dyens (rev. J Asmuth)"
  
}

dn={g''16}
da={g''16\RHa}
dm={g''16\RHm}
di={g''16\RHi}
dp={g''16\RHp}
ldn={g''8}
lda={g''8\RHa}
ldm={g''8\RHm}
ldi={g''8\RHi}
ldp={g''8\RHp}

\score {
  \compressMMRests <<
    \new Staff \with {
      \consists "Span_arpeggio_engraver"
      instrumentName = #"Guitar 5"
      shortInstrumentName = #"G5."
    } {
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \tempo 4=72
      
      \time 3/4
      
      \mark \markup {\box"A B C D"}
      R2.*92 |
      
      \mark \markup \box "E"
      \repeat percent 7	{
        r4^"pizz." <d''-1\RHp d'''-4\RHi e'''-4>_\pp <b'-3\RHp d''-1\RHp d'''-2> |
      }
      r4 <d'' d''' e'''> <c''-1 b''-4 e'''> |
      \repeat percent 9 {
        r4 <d'' d''' f'''-4> <b'-3 d''-1 d'''-1> |
      }
      r4 <d'' d''' e'''-3> <c''-3 d''-1 d'''> |
      
      \mark \markup \box "F"
      R2.*2
      <bes''-2>4^"vib."_\pp~ bes''16 <a''-1> <g''-4> <f''-1> <bes''-2>( <c'''-4>) <a''-1> <g''-4> |
      <bes''-2>8 a''16 g'' bes''4-> a''16( bes'') a'' g''~ |
      g''4~g''16 <f''-2>( <e''-1>) <d''-3> e''4~ |
      e''4 r8 <bes''-1--> <c'''-3-->[ <des'''-4-->~] |
      des'''8 <des'''-->4 <des'''-->8 <des'''--> <des'''--> |
      \tuplet 3/2 { <des'''-->8 <des'''--> <des'''--> } <des'''-->8 <c'''-3>16( <bes''-1>) des'''8 <c'''-3>16( <bes''-1>) |
      <<
        \new Voice { \voiceTwo
          \set fingeringOrientations = #'(left)
          des'''16( c''') bes'' <aes''-4\2> <g''-3>( <f''-1>) <e''-1>8~ e''4 |
        }
        \new Voice {\voiceOne
          \hideNotes
          s4 s16 a''16 \glissando g''8 s4 |
          \unHideNotes
        }
      >>
      e''2~ e''8 r8 |
      <d''-1>4. <e''-3>8 d''16( e'') <f''-4>8~ |
      f''4 <g''-1>8 <aes''-2> \tuplet 3/2 {<f''-4--> <g''-1--> <e''-3-->} |
      <d''-4>16( <e''-3>) d'' <c''-3>~ c''8 bes'->~ bes'4~ |
      bes'16 <c''-3> <bes'-1> c'' <d''-1>( <e''-3>) d'' <c''-1> <d''-3>( c'') bes' aes' |
      <bes'-3>16->( <aes'-1>) <g'-0>8~ g'8 <f'-1>->~ f'4~ |
      f'4~ f'16 <g'-3>( <f'-1>) <ees'-4>~ ees'4~ |
      ees'4 <f'-3>16( <ees'-1>) f' <des'-4>~ des'4 |
      des'4~ des'16 <des'-2>16( <ees'-4>) des' <f'-3>( ees') <des'-4> <c'-3>~ |
      
      \mark \markup \box "G"
      c'4 r r |
      R2.*1 
      <bes''-3>4~^"(altro solo)"^"metal." bes''16 <a''-1> <g''-4> <f''-1> <bes''-2>( <c'''-4>) <a''-1> <g''-4> |
      <bes''-2>8 a''16 g'' bes''4-> a''16( bes'') a'' g''~|
      g''4~ g''16 <f''-2>( <e''-1>) <d''-3> e''4~ |
      e''4 r8 <bes''-1-->8 <c'''-3-->[ <des'''-4-->~] |
      des'''8 des'''4-- des'''8-- des'''--[ des'''--] |
      \tuplet 3/2 {des'''8-- des'''8-- des'''8--} des'''8-- <c'''-3>16( <bes''-1>) des'''8 c'''16( bes'') |
      <<
        \new Voice {
          \set fingeringOrientations = #'(left)
          des'''16( c''') bes'' <aes''-4\2> <g''-3>->( <f''-1>) <e''-1>8~ e''4~ |
      
        }
        \new Voice {\voiceOne
          \hideNotes
          s4 s16 a''16 \glissando g''8 s4 |
          \unHideNotes
        }
      >>
      e''2~ e''8 r8 |
      <d''-1>4. <e''-3>8 d''16( e'') <f''-4>8~ |
      f''4 <g''-1>8 <aes''-2> \tuplet 3/2 {<f''-4-->8 <g''-1--> <e''-3-->} |
      <d''-1>16( <e''-3>) d'' <c''-3>~ c''8 <bes'-1>->~ bes'4~ |
      bes'16 <c''-3> <bes'-1> c'' <d''-1>( <e''-3>) d'' <c''-1> <d''-3>( c'') <bes'-3> <aes'-1> |
      <bes'-3>16_>( <aes'-1>) <g'-0>8~ g' <f'-1>_>~ f'4~ |
      f'4~ f'16 <g'-3>( <f'-1>) <ees'-4>~ ees'4~ |
      ees'4 <f'-3>16( <ees'-1>) f' <des'-4>~ des'4 |
      des'4~ des'16 <des'-2>( <ees'-4>) des' <f'-3>( ees') <des'-4> <c'-3>~ |
      
      \mark \markup \box "H"
      
      \set strokeFingerOrientations = #'(up)
      c'4^"croisez 5 et 6 (VII)" r r |
      R2.*1 |
      \repeat percent 8 {
        \override NoteHead.style = #'cross
        r8
        \tuplet 3/2 {\da[ \dm \di]}
        \ldp
        \tuplet 3/2 {\da[ \dm \di]}
        \ldp
        \ldi |
        
        \ldp
        \tuplet 3/2 {\dn[ \dn \dn]}
        \ldn
        \tuplet 3/2 {\dn[ \dn \dn]}
        \tuplet 3/2 {\dp[ \dm \di]}
        \tuplet 3/2 {\dp[ \dm \di]} |
        \revert NoteHead.style
      }
    }
  >>
}

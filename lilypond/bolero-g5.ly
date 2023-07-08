\version "2.24.1"

\include "common.ly"

\header {
  title = "Boléro"
  composer = "Maurice Ravel"
  arranger = "arr. Roland Dyens"
  tagline = "rev. J Asmuth"
}

dn={g''16}
ds={g''16\staccato}
da={g''16\RHa}
dm={g''16\RHm}
di={g''16\RHi}
dp={g''16\RHp}
ldn={g''8}
lds={g''8\staccato}
lda={g''8\RHa}
ldm={g''8\RHm}
ldi={g''8\RHi}
ldp={g''8\RHp}

\markup "Tempo di bolero - moderato assai" 

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
      \repeat volta 7	{
        r4^"pizz."_"x7"
        <<
          \new Voice{ \voiceOne 
            \set fingeringOrientations = #'(left)
            <e'''-1>_\pp^"a 2"^"XII" <d'''-3> |
          }
          \new Voice{ \voiceTwo
            \set fingeringOrientations = #'(left up)
            <d''-1 d'''-3> 
            \set fingeringOrientations = #'(left)
            \arpeggioParenthesis <b'-2 d''-1> \arpeggio |
          }
        >>
      }
      
      \set Score.currentBarNumber = #100
      <<
        \new Voice{ \voiceOne 
          \set fingeringOrientations = #'(left)
          \oneVoice r4 \voiceOne <e'''-1>^"XII" <e'''-4>^"X" |
          \repeat volta 9 {
            \oneVoice r4_"x9" \voiceOne <f'''-2>^"XII" <d'''-3> |
          }
          \set Score.currentBarNumber = #110
          \oneVoice r4 \voiceOne <e'''-1>^"XII" <d'''-3> |
        }
        \new Voice{ \voiceTwo
          \set fingeringOrientations = #'(left up)
          s4 <d''-1 d'''-3> 
          \set fingeringOrientations = #'(left)
          <c''-1 b''-3> |
            
          \repeat volta 9 {
            s4 <d''-1 d'''-3> \arpeggioParenthesis <b'-2 d''-1> \arpeggio |
          }
          \set fingeringOrientations = #'(left up)
          s4 <d''-1 d'''-3> 
          \set fingeringOrientations = #'(left)
          \arpeggioParenthesis <b'-2 d''-1> \arpeggio |
        }
      >>
      
      \mark \markup \box "F"
      \set Score.currentBarNumber = #111
      R2.*2
      <bes''-2>4^"vib."_\pp~ bes''16 <a''-1> <g''-4> <f''-1> <bes''-2>( <c'''-4>) <a''-1> <g''-4> |
      <bes''-2>8 a''16 g'' bes''4-> a''16( bes'') a'' g''~ |
      g''4~g''16 <f''-2>( <e''-1>) <d''-3> e''4~ |
      e''4 r8 <bes''-1--> <c'''-3-->[ <des'''-4-->~] |
      des'''8 <des'''-->4 <des'''-->8 <des'''--> <des'''--> |
      \tuplet 3/2 { <des'''-->8 <des'''--> <des'''--> } <des'''-->8 <c'''-2>16( <bes''-1>) des'''8 <c'''>16( <bes''>) |
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
      <d''-1>16( <e''-3>) d'' <c''-3>~ c''8 bes'->~ bes'4~ |
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
      \tuplet 3/2 {des'''8-- des'''8-- des'''8--} des'''8-- <c'''-2>16( <bes''-1>) des'''8 c'''16( bes'') |
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
      \repeat volta 8 {
        \override NoteHead.style = #'cross
        r8
        \tuplet 3/2 {\da^"solo"_"x8"[ \dm \di}
        \ldp]
        \tuplet 3/2 {\da[ \dm \di}
        \ldp]
        \ldi |
        
        \ldp
        \tuplet 3/2 {\dn[ \dn \dn}
        \ldn]
        \tuplet 3/2 {\dn[ \dn \dn]}
        \tuplet 3/2 {\dp[ \dm \di]}
        \tuplet 3/2 {\dp[ \dm \di]} |
        \revert NoteHead.style
        
      }
      
      \break
      \mark \markup \box "I"
      \set Score.currentBarNumber = #165
      <<
        \new Voice {
          \repeat percent 4 {
            \repeat volta 18 {
              \override NoteHead.style = #'cross
              \lds^"tutti" \tuplet 3/2 {\dn[ \dn \dn} \lds] \tuplet 3/2 {\dn[ \dn \dn} \lds] \lds |
              \lds \tuplet 3/2 {\dn[ \dn \dn} \lds] \tuplet 3/2 {\dn[ \dn \dn]} \tuplet 3/2 {\dn[ \dn \dn]} \tuplet 3/2 {\dn[ \dn \dn]} |
              \revert NoteHead.style
            }
          }
        }
        \new Voice {
          \repeat volta 2 {
           s2._"x9" s2. 
          }
          \mark \markup \box "J"
          \set Score.currentBarNumber = #183
          \repeat volta 2 {
           s2._"x9" s2. 
          }
          \mark \markup \box "K"
          \set Score.currentBarNumber = #200
          \repeat volta 2 {
           s2._"x9" s2. 
          }
          \mark \markup \box "L"
          \set Score.currentBarNumber = #219
          \repeat volta 2 {
           s2._"x9" s2. 
          }
        }
      >>
      
      \break
      \mark \markup \box "M"
      \set Score.currentBarNumber = #237
      \override NoteHead.style = #'cross
      \lds \tuplet 3/2 {\dn[ \dn \dn} \lds] \tuplet 3/2 {\dn[ \dn \dn} \lds] \lds |
      \lds r8 r4 r4 |
      \revert NoteHead.style
      <c'''-2>4~ c'''8 <b''-1>16 c''' <d'''-4>( c''') b'' <a''-4> |
      c'''8 16 a'' c'''4~ 8 b''16 c''' |
      
      <<
        \new Voice {
          \set fingeringOrientations = #'(left)
          <a''-3\1>16( <g''-1>) <e''-3> <f''-4> g''2~ |
          g''16 <f''-4>( <e''-3>) <d''-1> e''( f'') <g''-1>( <a''-3>) g''4~ |
          g''4~ g''16 <a''-1>( <b''-3>) a'' <g''-4\2>( <f''-2>) <e''-1> <d''-3>  |
          <e''-3>16( <d''-1>) <c''-4\4>8~ c''8 <c''-1\3>16( <d''-3>) <e''-1\2>8\staccato <f''-2>\staccato |
      
        }
        \new Voice {\voiceOne
          \hideNotes
          s2. s2. |
          s4 s4 s8 s16 <g''>\glissando  |
          <a''>16
          \unHideNotes
        }
      >>
      <d''-3\3>4 <g''-4\2>2~ |
      g''2~ g''8 r8 |
      <d'''-4>4~ d'''8. <c'''-2>16 <b''-1> <a''-4> b'' c''' |
      <d'''-4>16( <c'''-2>) <b''-1>8~ b''16 c'''( b'') a'' c'''( b'') a'' <f''-1\2>~ |
      f''8 <f''-2>16 \staccato f'' \staccato f''8 \staccato <a''-1> \staccato <c'''-4>16( <a''-1>) <b''-3> <g''-4> |
      <f''-2>8 <f''-3>16 \staccato f'' \staccato f''8 \staccato <a''-2> \staccato <b''-4\1>16( <g''-1>) <a''-3> <f''-4> |
      <d''-1>8 <d''-3>16( <c''-1>) d''4~ 8 16 \staccato 16 \staccato |
      d''8 \staccato <f''-1> \staccato <a''-4>16( f'') <g''-2> <e''-4> <d''-2>8 <d''-3>16( <c''-1>) |
      d''4~ 8 16( c'') d''8 <e''-1>16( <f''-2>) |
      <g''-4>2~ 16 <f''-2>( <e''-1>) <d''-3> |
      
      \mark \markup \box "N"
      c''8 r c'''-> r b''-> r |
      r4 c'''8-> r b''-> r |
      <bes'-2>4~ 16 <a'-1> <g'-4> <f'-1> bes'( <c''-4>) a' <g'-4> |
      <bes'-2>8 a'16( <g'-4>) bes'4 <a'-1>16( bes') a' <g'-4>~ |
      g'4~ 16 <f'-2>( <e'-1>) <d'-0> e'4~ |
      e'4 r8 <bes'-1>8-_ <c''-3>-_ <des''-4>-_~ |
      des''8 4-_ 8-_ 8-_[ 8-_] |
      \tuplet 3/2 {des''8-- 8-- 8--} des''8-- <c''-3>16( <bes'-1>) des''8 c''16( bes') |
      <<
        \new Voice {
          \set fingeringOrientations = #'(left)
          <des''-4>16( <c''-3>) <bes'-1> <aes'-4> <g'-3>( <f'-1>) <e'-1>8~ 4~ |
          e'2~ 8 r |
        }
        \new Voice {\voiceOne
          \hideNotes
          s4 s16 <c'>\glissando b8 s4  |
          s2. |
          \unHideNotes
        }
      >> |
      <d'-0>4. <e'-2>8 d'16( e') <f'-3>8~ |
      f'4 <g'-0>8 <bes'-1> \tuplet 3/2 {<f'-2>8_- <g'-4>_- <e'-1>_-} |
      <d'-0>16( <e'-2>) d' <c'-3>~ 8 <bes-1>~ 4~ |
      <bes>16 c' bes c' <d'-0>( <e'-1>) d' <c'-1> <d'-3>( c') <bes-4> <aes-2> |
      <bes-4>16( <aes-2>) <g-1>8 r4^"pizz."^"div."
      <<
        \new Voice {\voiceOne
          \set fingeringOrientations = #'(right)
          \arpeggioBracket <aes'' c''' g'''-4>4^"XIII" \arpeggio |
          g4^"ord." \arpeggioBracket <aes'' c''' g'''-4>4 \arpeggio <g'-0 bes''-1 g'''-4> |
          g4 <g'-0 bes''-1 g'''-4> \arpeggioBracket <aes''-1 c'''-1 g'''-4> \arpeggio |
          g4 <aes''-1 c'''-1 g'''-4> <g''-1 c'''-2 g'''-4> |
        }
        \new Voice {\voiceTwo
          \set fingeringOrientations = #'(left)
          \arpeggioBracket <aes'-4 c'' d'' g''>4_"III" \arpeggio |
          g4 \arpeggioBracket <aes'-4 c'' d'' g''>4 \arpeggio <bes'-2 c''-1 g''-3 c'''-4> |
          g4 <bes'-2 c''-1 g''-3 c'''-4> <g'-0 aes'-1 g''-3 c'''-4> |
          g4 <g'-0 aes'-1 g''-3 c'''-4> \arpeggioBracket <g'-1 c''-1 g''-3 c'''-4> \arpeggio |
        }
      >> |
      \break
      \mark \markup \box "O"
      R2.*2^"croisez 5 et 6"
      <<
        \new Voice {
          \override NoteHead.style = #'cross
          r8 \tuplet 3/2 {\dn[ \dn \dn} \lds] \tuplet 3/2 {\dn[ \dn \dn]} \tuplet 3/2 {\dn[ \dn \dn]} \tuplet 3/2 {\dn[ \dn \dn]} |
          \lds \tuplet 3/2 {\dn[ \dn \dn} \lds] \tuplet 3/2 {\dn[ \dn \dn]} \tuplet 3/2 {\dn[ \dn \dn]} \tuplet 3/2 {\dn[ \dn \dn]} |
          \revert NoteHead.style
          \repeat percent 3 {
            \override NoteHead.style = #'cross
            \lds \tuplet 3/2 {\dn[ \dn \dn} \lds] \tuplet 3/2 {\dn[ \dn \dn} \lds] \lds |
            \lds \tuplet 3/2 {\dn[ \dn \dn} \lds] \tuplet 3/2 {\dn[ \dn \dn]} \tuplet 3/2 {\dn[ \dn \dn]} \tuplet 3/2 {\dn[ \dn \dn]} |
            \revert NoteHead.style
          }
          
          \repeat percent 2 {
            \override NoteHead.style = #'cross
            \lds \tuplet 3/2 {\dn[ \dn \dn} \lds] \tuplet 3/2 {\dn[ \dn \dn} \lds] \lds |
            \lds \tuplet 3/2 {\dn[ \dn \dn} \lds] \tuplet 3/2 {\dn[ \dn \dn]} \tuplet 3/2 {\dn[ \dn \dn]} \tuplet 3/2 {\dn[ \dn \dn]} |
            \revert NoteHead.style
          }
        }
        \new Voice {
          \set Score.currentBarNumber = #275
          s2.*2
          \break
          \repeat volta 2 {
            s2._"x8" s2. 
          }
          \mark \markup \box "P"
          \set Score.currentBarNumber = #291
          \repeat volta 2 {
            s2._"x9" s2. 
          }
          \mark \markup \box "Q"
          \set Score.currentBarNumber = #309
          \repeat volta 2 {
            s2._"x8" s2. 
          }
          \break
          s2.
          \noBreak
          \mark \markup \box "R"
          \set Score.currentBarNumber = #326
          \noBreak
          s2.
          \repeat volta 2 {
          \noBreak
            s2._"x6"
          \noBreak
            s2.
          }
        }
      >>
      \break
      \set Score.currentBarNumber = #339
      \override NoteHead.style = #'cross
      \ldn g''8-> r4 \tuplet 3/2 {r16 \dn[ \dn] } \tuplet 3/2 {\dn[ \dn \dn] } |
      \ldn r8 r4 r4 |
      \revert NoteHead.style
      
      \bar "|."
    }
  >>
}

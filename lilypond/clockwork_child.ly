\version "2.20.0"
\header {
  title = "Maker Fire Clockwork Child"
  composer = "John Asmuth"
  tagline = ""
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)

detuning_tail = {
  \repeat tremolo 8 {e8} |
  \repeat tremolo 8 {dis8} | \repeat tremolo 8 {dis} |
  
  \repeat tremolo 8 {e8} | \repeat tremolo 8 {e} |
  \repeat tremolo 8 {dis}| \repeat tremolo 8 {dis} |
  
  \repeat tremolo 8 {cis8} | \repeat tremolo 8 {dis} |
}

detuning_instructions = {
  <e-0>8-"open string, detuning, retuning" e e e e e e e |
  \detuning_tail
}

detuning_csharp = {
  \repeat tremolo 8 {e8-\markup{ "leave" \circle 6 "on C-sharp if preferred"}} |
  \detuning_tail
}

detuning = {
  \repeat tremolo 8 {e8} |
  \detuning_tail
}

bf_stoking = { bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r | }
bfef_stoking = { <bes' ees''>8\staccato r4 <bes' ees''>8\staccato r4 <bes' ees''>8\staccato r | }
bfcf_stoking = { <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r | }
bfdf_stoking = { <bes' des''>8\staccato r4 <bes' des''>8\staccato r4 <bes' des''>8\staccato r | }
bfa_stoking = { <bes' a'>8\staccato r4 <bes' a'>8\staccato r4 <bes' a'>8\staccato r | }

fullcyclerest = { 
  r1 | r1 | r1 | r1 |
  r1 | r1 | r1 | r1 |
  r1 | r1 |
}
fullcyclespace = { 
  s1 | s1 | s1 | s1 |
  s1 | s1 | s1 | s1 |
  s1 | s1 |
}

<<
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Child"
  shortInstrumentName = #"Ch."
}
{
  \tempo 4 = 140
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \fullcyclerest
      
      \break \bar "||"
      
      \fullcyclerest
      
      \break \bar "||"
      
      \fullcyclerest
      
      \break \bar "||"
      
      r1 | r1 |
      r4 e''4 fis'' e'' | fis''2~ fis''4 e'' |
      fis''2 g'' | fis''4 g'' fis''4~ fis''8 g'' |
      g''2 g'' | <f'' g''>2 <f'' g''> |
      <e'' g''>4. <e'' aes''>4. <e'' g''>4 | <dis'' aes''>4. <dis'' g''>4. <dis'' aes''>4 |
      
      \break \bar "||"
      
      a''16 ces'' bes' g' r4 r2 |
      r1\fermata |
      
      \break \bar "||"
      
      r1 r1 |
      e'''4. d'''8 cis'''4 d''' | cis'''2 b'' |
      d'''4. cis'''8 b''4 cis''' | b''2 ais'' |
      e'''8 e''' e''' d''' cis''' cis''' d''' d''' | cis'''8 cis''' cis''' cis''' b'' b'' b'' b'' |
      d'''8 d''' d''' cis''' b'' b'' cis''' cis''' | b'' b'' b'' b'' ais'' ais'' ais'' ais'' |
      \break \bar "||"
      
      \repeat tremolo 12 {e'''32^"trem."} \repeat tremolo 4 {d'''32} \repeat tremolo 8 {cis'''32} \repeat tremolo 8 { d'''32 } |
      \repeat tremolo 16 {cis'''32} \repeat tremolo 16 {b''32} |
      \repeat tremolo 12 {d'''32} \repeat tremolo 4 {cis'''32} \repeat tremolo 8 {b''32} \repeat tremolo 8 { cis'''32 } |
      \repeat tremolo 16 {b''32} \repeat tremolo 16 {ais''32} |
      
      \repeat tremolo 12 {e'''32^"div."} \repeat tremolo 4 {d'''32} \repeat tremolo 8 {cis'''32} \repeat tremolo 8 { d'''32 } |
      \repeat tremolo 16 {cis'''32} \repeat tremolo 16 {b''32} |
      \repeat tremolo 12 {d'''32} \repeat tremolo 4 {cis'''32} \repeat tremolo 8 {b''32} \repeat tremolo 8 { cis'''32 } |
      \repeat tremolo 16 {b''32} \repeat tremolo 16 {ais''32} |
      
      \repeat tremolo 12 {e'''32} \repeat tremolo 4 {d'''32} \repeat tremolo 12 {e'''32} \repeat tremolo 4 {d'''32} |
      \repeat tremolo 12 {e'''32} \repeat tremolo 4 {d'''32} \repeat tremolo 12 {e'''32} d'''8 |
      \break \bar "||"
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \fullcyclespace
      
      \fullcyclespace
      \fullcyclespace
      \fullcyclespace
      
      s1 s1 |
      
      \fullcyclespace
      
      s1 | s1 | s1 | s1 |
      
      \repeat tremolo 12 {cis'''32} \repeat tremolo 4 {b''32} \repeat tremolo 8 {ais''32} \repeat tremolo 8 { b''32 } |
      \repeat tremolo 16 {ais''32} \repeat tremolo 16 {gis''32} |
      \repeat tremolo 12 {b''32} \repeat tremolo 4 {ais''32} \repeat tremolo 8 {gis''32} \repeat tremolo 8 { ais''32 } |
      \repeat tremolo 16 {gis''32} \repeat tremolo 16 {g''32} |
      \repeat tremolo 12 {cis'''32} \repeat tremolo 4 {b''32} \repeat tremolo 12 {ais''32} \repeat tremolo 4 {gis''32} |
      \repeat tremolo 12 {g''32} \repeat tremolo 4 {f''32} \repeat tremolo 12 {e''32} d''8 |
      
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
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Clockwork"
  shortInstrumentName = #"Cl."
}
{
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \fullcyclerest
      
      \fullcyclerest
      
      \repeat percent 3 {
        bes'4 r8 bes'4 r8 bes'4 | r8 bes'4 r8 bes'4 r8 bes'8~ | bes'8 r8 bes'4 r8 bes'4 r8 |
      }
      bes'8\< bes' bes' bes' bes' bes' bes' bes'\! | 
      
      r1 | r1 |
      \repeat percent 2 {
        aes'8 bes' ces'' des'' ces'' bes' aes' bes' | ces''8 des'' ces'' bes' aes' bes' ces'' des'' | ces'' bes'8 aes' bes' ces'' des'' ces'' bes' |
      }
      aes'8 bes' ces'' des'' ces'' bes' aes' bes' | ces''8 des'' ces'' bes' aes' bes' ces'' des'' |
      
      r4 d''16 aes' e' g r2 |
      r1\fermata |
      
      r1 r1 |
      \repeat percent 3 {
        e''8 d'' e'' d'' e'' fis'' e'' d'' | cis''8 b' cis'' b' cis'' b' ais' b' |
      }
      <g' e''>8 <fis' d''> <e' cis''> <g' e''> <fis' d''> <e' cis''> <g' e''> <fis' d''> |
      <e' cis''>8 <g' e''> <fis' d''> <e' cis''> <g' e''> <fis' d''> <e' cis''> <d' b'> |
      
      \repeat percent 5 {
      <g' e''>8 <fis' d''> <e' cis''> <g' e''> <fis' d''> <e' cis''> <g' e''> <fis' d''> |
      <e' cis''>8 <g' e''> <fis' d''> <e' cis''> <g' e''> <fis' d''> <e' cis''> <d' b'> |
      }
       
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
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

\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Fire"
  shortInstrumentName = #"F."
}
{
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \fullcyclerest
      
      \repeat percent 10 {bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r | }
       
      \repeat percent 10 {bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r | }
       
      \repeat percent 2 {\bfef_stoking} \repeat percent 2 {\bfcf_stoking}
      \repeat percent 2 {\bfdf_stoking} \repeat percent 2 {\bfcf_stoking}
      \bfa_stoking \bfcf_stoking
      
      r2 bes'16 ges' d' a r4 |
      r1\fermata |

      \repeat percent 2 {
      <des' ges' bes' ces''>8\staccato r4 <des' ges' bes' ces''>8\staccato r4 <des' ges' bes' ces''>4\staccato |
      <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>4\staccato |
      <des' ges' bes' d''>8\staccato r4 <des' ges' bes' d''>8\staccato r4 <des' ges' bes' d''>4\staccato |
      <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>4\staccato |
      }
      <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>4\staccato |
      <des' ges' bes' des''>8\staccato r4 <des' ges' bes' d''>8\staccato r4 <des' ges' bes' des''>4\staccato |

      \repeat percent 2 {
      <des' ges' bes' ces''>8\staccato r4 <des' ges' bes' ces''>8\staccato r4 <des' ges' bes' ces''>4\staccato |
      <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>4\staccato |
      <des' ges' bes' d''>8\staccato r4 <des' ges' bes' d''>8\staccato r4 <des' ges' bes' d''>4\staccato |
      <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>4\staccato |
      }
      <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>4\staccato |
      <des' ges' bes' des''>8\staccato r4 <des' ges' bes' d''>8\staccato r4 <des' ges' bes' des''>4\staccato |
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
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
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Maker"
  shortInstrumentName = #"M."
}
{
  \set Staff.connectArpeggios = ##t
  % \partial 4
  \key a \minor
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      
      \detuning_instructions
      \detuning
      \detuning_csharp
      \detuning
      
      e4_\markup {"pizz. B." \draw-dashed-line #'( 55 . 0) }\staccato e\staccato e\staccato e16(f e8\staccato) |
      r1\fermata |
      
      \repeat percent 2{
      <e bes>4 <e bes>8 <e bes>4 <e bes>8 <e bes>4 |
      <fis bes>4 <fis bes>8 <fis bes>4 <fis bes>8 <fis bes>4 |
      <g bes>4 <g bes>8 <g bes>4 <g bes>8 <g bes>4 |
      <fis bes>4 <fis bes>8 <fis bes>4 <fis bes>8 <fis bes>4 |
      }
      <cis' bes>4 <cis' bes>8 <cis' bes>4 <cis' bes>8 <cis' bes>4 |
      <cis' bes>4 <cis' bes>8 <d' bes>4 <d' bes>8 <cis' bes>4 |
      
      \repeat percent 2{
      <e bes>4 <e bes>8 <e bes>4 <e bes>8 <e bes>4 |
      <fis bes>4 <fis bes>8 <fis bes>4 <fis bes>8 <fis bes>4 |
      <g bes>4 <g bes>8 <g bes>4 <g bes>8 <g bes>4 |
      <fis bes>4 <fis bes>8 <fis bes>4 <fis bes>8 <fis bes>4 |
      }
      <cis' bes>4 <cis' bes>8 <cis' bes>4 <cis' bes>8 <cis' bes>4 |
      <cis' bes>4 <cis' bes>8 <d' bes>4 <d' bes>8 <cis' bes>4 |
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
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
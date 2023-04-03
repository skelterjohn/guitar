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
      \repeat percent 2 {\bfa_stoking}
      
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